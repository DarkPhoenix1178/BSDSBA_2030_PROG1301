#!/usr/bin/env python3
"""
Thoughtful Solitaire - Klondike where every card is face up,
plus hidden cards to test how the solver copes with missing information.

Run:  python ui.py                   (tkinter comes with Python)

The project is split into 3 files (keep them in the same folder):
  optimal_solver.py  card rules, moves and the search (A* and IDA*)
  hidden_cards.py    hidden cards: uncover search, solve() and game side
  ui.py              the game window (this file)

SETUP (start of every game)
  click a card or a stock chip ... hide it face-down (click again to show it)
  Random ......................... hide RANDOM_HIDE random cards
  Start solver / Play myself ..... begin the game

PLAYING
  drag a card or run ... move it     double-click ... send to the best spot
  click the stock ...... draw a card Ctrl+Z ......... undo
  S = solve   P = peek at hidden cards   N = new game

CODE STYLE
  The code follows PEP 8 (79-character lines, snake_case names, docstrings).
  `assert` statements check things that can only go wrong if the code has a
  bug, such as a card being lost or a move being illegal. Python skips them
  when run with `python -O`, so they are never used for checks the program
  needs in order to work.

A hidden card can't move. It flips face up when it becomes the top card of its
column or is drawn from the stock. The solver can't see hidden cards, so it
plays the shortest line that uncovers one, then plans again. With nothing
hidden it searches for a full win. When it is stuck it stops, and the panel on
the right says why.
"""

import random
import threading
import time
import tkinter as tk

from hidden_cards import (
    RANDOM_HIDE,
    SOLVE_SECONDS,
    HiddenCardsMixin,
    solve,
)
from optimal_solver import (
    SUITS,
    fits,
    fmt_time,
    foundation_ok,
    is_legal,
    is_red,
    legal_moves,
    name,
    stacks_on,
)

# ----- settings you can change -----
MOVE_DELAY = 250  # milliseconds between solver moves

FELT, SLOT, BAR, PANEL_BG = "#14603f", "#2f8a62", "#0b3a28", "#0d4430"
GOLD, IVORY, INK, RED = "#e8c46a", "#fbf8ef", "#1b2030", "#c0392b"
MUTED, GREEN, PINK = "#9cc7b2", "#7be0a6", "#ff8a7a"
BLUE_BACK, HIDDEN_BACK = "#2b4f96", "#7a2e52"
TOP_BAR, STRIP, PANEL = 54, 66, 350  # heights / width of the screen areas


# =============================================================================
#  GAME WINDOW
# =============================================================================


class Solitaire(HiddenCardsMixin):
    def __init__(self, root):
        self.root = root
        root.title("Thoughtful Solitaire")
        root.geometry("1420x840")
        root.minsize(1120, 660)
        self.cv = tk.Canvas(root, bg=FELT, highlightthickness=0)
        self.cv.pack(fill="both", expand=True)
        self.width, self.height = 1420, 840
        self.history, self.game_no, self.job = [], 0, 0
        self.peek, self.panel_time, self.restack = False, 0, False
        self.size()

        self.cv.bind("<Configure>", self.on_resize)
        self.cv.bind("<ButtonPress-1>", self.on_press)
        self.cv.bind("<B1-Motion>", self.on_drag)
        self.cv.bind("<ButtonRelease-1>", self.on_release)
        root.bind("<Control-z>", lambda e: self.undo())
        root.bind("<Command-z>", lambda e: self.undo())
        root.bind("n", lambda e: self.new_game())
        root.bind("s", lambda e: self.start_solver())
        root.bind("p", lambda e: self.toggle_peek())

        self.new_game()
        self.tick()

    # ------------------------------------------------------------------ game
    def new_game(self):
        deck = [(s, r) for s in range(4) for r in range(1, 14)]
        assert len(set(deck)) == 52, "the deck must hold 52 different cards"
        random.shuffle(deck)
        self.tab = [[deck.pop() for _ in range(n + 1)] for n in range(7)]
        assert len(deck) == 24, "24 cards should be left for the stock"
        self.found = [[] for _ in range(4)]
        # stock.pop() gives the next card drawn.
        self.stock, self.waste = deck, []
        self.hidden, self.flash, self.reveals = set(), {}, []
        self.moves, self.undo_stack = 0, []
        self.clock_start = self.clock_end = None
        self.phase, self.auto, self.won = "setup", False, False
        self.run, self.status, self.message = None, "", ""
        self.drag, self.last_click = None, (None, 0)
        # Cancels a solver that is still running.
        self.job += 1
        self.game_no += 1
        self.cv.delete("card")
        # card -> (look, position it is drawn at)
        self.drawn = {}
        self.layout()
        # Deal animation: fly out of the stock.
        sx, sy = self.col_x(0), self.top_y
        self.pos = {c: [sx, sy] for c in self.target}
        dealt = [c for col in self.tab for c in col]
        self.delay = {c: time.time() + 0.035 * n for n, c in enumerate(dealt)}

    def foundation_counts(self):
        """Return how many cards are on each foundation."""
        return tuple(len(f) for f in self.found)

    def do(self, mv):
        """Carry out one move (same format as the solver's moves)."""
        assert is_legal(self.solver_view(), mv), f"illegal move: {mv}"
        self.undo_stack.append(
            (
                [list(p) for p in self.tab],
                [list(f) for f in self.found],
                list(self.stock),
                list(self.waste),
                set(self.hidden),
                self.moves,
            )
        )
        self.phase = "play"
        kind = mv[0]
        if kind == "draw":
            if self.stock:
                self.waste.append(self.stock.pop())
            else:
                self.stock, self.waste = self.waste[::-1], []
        elif kind == "w2f":
            c = self.waste.pop()
            self.found[c[0]].append(c)
        elif kind == "w2t":
            self.tab[mv[1]].append(self.waste.pop())
        elif kind == "t2f":
            c = self.tab[mv[1]].pop()
            self.found[c[0]].append(c)
        else:
            _, i, k, j = mv
            self.tab[j] += self.tab[i][k:]
            del self.tab[i][k:]
        self.moves += 1
        self.clock_start = self.clock_start or time.time()
        self.flip_uncovered()
        self.check_board()
        self.layout()
        if sum(self.foundation_counts()) == 52:
            self.won, self.clock_end = True, time.time()

    def undo(self):
        if self.undo_stack and not self.auto and not self.won:
            (
                self.tab,
                self.found,
                self.stock,
                self.waste,
                self.hidden,
                self.moves,
            ) = self.undo_stack.pop()
            self.check_board()
            self.layout()

    def check_board(self):
        """Assert that the real board is in a legal state.

        Every card must be somewhere exactly once, each foundation must be
        one suit in order (A, 2, 3...), and no hidden card may be on top of
        a column or the waste, because it should have flipped.
        """
        cards = [c for col in self.tab for c in col]
        cards += self.stock + self.waste
        cards += [c for pile in self.found for c in pile]
        assert len(cards) == 52, f"expected 52 cards, found {len(cards)}"
        assert len(set(cards)) == 52, "a card appears twice"
        for suit, pile in enumerate(self.found):
            expected = [(suit, rank) for rank in range(1, len(pile) + 1)]
            assert pile == expected, f"foundation {suit} is out of order"
        on_top = [p[-1] for p in self.tab + [self.waste] if p]
        assert not self.hidden & set(on_top), "a hidden card is on top"
        home = {c for pile in self.found for c in pile}
        assert not self.hidden & home, "a hidden card is on a foundation"

    def start_solver(self):
        if self.auto or self.won:
            return
        self.phase, self.auto, self.message = "play", True, ""
        self.job += 1
        self.run = {
            "start": time.time(),
            "end": None,
            "result": None,
            "hidden": len(self.hidden),
            "revealed": 0,
            "plans": 0,
            "nodes": 0,
            "think": 0.0,
            "moves": self.moves,
            "headline": "",
            "why": [],
        }
        self.think(self.job)

    def stop_solver(self):
        self.job += 1
        self.finish("stopped", "user")

    def think(self, job):
        """Start the solver in a background thread.

        This keeps the window responsive while the solver thinks.
        """
        if self.won:
            return self.finish("solved")
        self.status = (
            f"Looking for a way to uncover a hidden card "
            f"({len(self.hidden)} left)..."
            if self.hidden
            else f"Searching for a full solution (up to {SOLVE_SECONDS}s)..."
        )
        state, box = self.solver_view(), {}

        def work():
            t = time.time()
            result = solve(state)
            result["think"] = time.time() - t
            box["result"] = result

        threading.Thread(target=work, daemon=True).start()
        self.wait_for(job, box)

    def wait_for(self, job, box):
        if job != self.job:  # new game or Stop was pressed
            return
        if "result" not in box:
            self.root.after(100, lambda: self.wait_for(job, box))
            return
        r = box["result"]
        self.run["plans"] += 1
        self.run["nodes"] += r["nodes"]
        self.run["think"] += r["think"]
        if r["path"]:
            what = (
                "to uncover a card"
                if r["label"] == "uncover"
                else f"({r['label']} plan)"
            )
            self.status = f"Playing {len(r['path'])} moves {what}"
            # Play the plan, then plan again.
            self.play_moves(job, r["path"], lambda: self.think(job))
        else:
            # Stuck: get as many cards home as possible.
            self.status = "Stuck - playing the last useful moves"
            self.play_moves(
                job, r["progress"], lambda: self.finish("stopped", r["status"])
            )

    def play_moves(self, job, moves, then):
        if job != self.job:
            return
        if not moves or self.won:
            return then()
        self.do(moves[0])
        wait = MOVE_DELAY // 2 if moves[0][0] == "draw" else MOVE_DELAY
        self.root.after(wait, lambda: self.play_moves(job, moves[1:], then))

    def finish(self, result, reason=None):
        run = self.run
        if not run or run["result"]:
            return
        self.auto = False
        run.update(
            result=result, end=time.time(), at=time.strftime("%H:%M:%S")
        )
        if result == "solved":
            run["headline"], self.status = (
                "All 52 cards are on the foundations",
                "Solved",
            )
        else:
            run["headline"], run["why"] = self.explain(reason)
            self.status = "Stopped"
        self.history.append(
            dict(
                game=self.game_no,
                result=result,
                moves=self.moves - run["moves"],
                time=run["end"] - run["start"],
                home=sum(self.foundation_counts()),
                hidden=run["hidden"],
                revealed=run["revealed"],
                reason=run["headline"],
            )
        )

    # ------------------------------------------- why the solver stopped
    def where_is(self, c):
        if c in self.found[c[0]]:
            return "already on its foundation"
        note = " (hidden)" if c in self.hidden else ""
        for i, col in enumerate(self.tab):
            if c in col:
                above = len(col) - 1 - col.index(c)
                return (
                    f"column {i + 1}, "
                    + (f"under {above} card(s)" if above else "on top")
                    + note
                )
        if c in self.stock:
            return (
                f"stock, #{len(self.stock) - self.stock.index(c)} to draw"
                + note
            )
        if c in self.waste:
            return "waste, " + ("on top" if c == self.waste[-1] else "buried")
        return "not in play"

    def explain(self, reason):
        """Return (headline, list of reasons) for the statistics panel."""
        run = self.run
        headline, why = {
            "blocked": (
                "Blocked by hidden cards",
                f"No moves with the visible cards can uncover any of the "
                f"{len(self.hidden)} hidden card(s); every reachable "
                f"position was checked.",
            ),
            "dead_end": (
                "Dead end: no winning line",
                "With every card visible, no reachable position wins "
                "the game.",
            ),
            "limit": (
                "Search limit reached",
                f"{run['nodes']:,} positions checked in "
                f"{run['think']:.1f}s without finding a way forward. "
                f"The game may still be winnable with more time.",
            ),
            "user": ("Stopped by you", ""),
        }[reason]
        lines = [why] if why else []
        # What is sitting on each hidden card.
        for i, col in enumerate(self.tab):
            for k, c in enumerate(col[:-1]):
                if c in self.hidden:
                    x = col[k + 1]
                    if x[1] == 13:
                        spots = "an empty column"
                    else:
                        other = (0, 3) if is_red(x) else (1, 2)
                        spots = " or ".join(
                            f"{name((s, x[1] + 1))} "
                            f"({self.where_is((s, x[1] + 1))})"
                            for s in other
                        )
                    lines.append(
                        f"Column {i + 1}: {name(x)} sits on the hidden "
                        f"card and must move first. It needs {spots}, or "
                        f"its foundation."
                    )
                    break
        lines.append(
            "Foundations: "
            + "  ".join(
                f"{SUITS[s]} {n}"
                for s, n in enumerate(self.foundation_counts())
            )
        )
        useful = [m for m in legal_moves(self.solver_view()) if m[0] != "draw"]
        lines.append(f"Moves left besides drawing: {len(useful)}")
        blocks = [
            f"{name(c)} on {name(b)} (col {i + 1})"
            for i, col in enumerate(self.tab)
            for k, c in enumerate(col)
            for b in col[:k]
            if b[0] == c[0] and b[1] < c[1]
        ]
        if blocks:
            lines.append(
                f"Same-suit blocks: {len(blocks)}, e.g. "
                + ", ".join(blocks[:3])
                + ". The higher card must move before the lower one can "
                "go home."
            )
        if run["hidden"]:
            lines.append(
                f"Hidden cards: {run['hidden']} at start, "
                f"{run['revealed']} revealed, "
                f"{len(self.hidden)} still hidden."
            )
        return headline, lines

    # ---------------------------------------------------------------- layout
    def size(self):
        """Work out card size and positions from the window size."""
        board_w = self.width - PANEL
        self.cw = max(
            44,
            min(
                board_w * 0.93 / 7.9,
                (self.height - TOP_BAR - STRIP - 24) / 5.1,
                122,
            ),
        )
        self.ch, self.gap = self.cw * 1.42, self.cw * 0.15
        self.left = (board_w - 7 * self.cw - 6 * self.gap) / 2
        self.top_y = TOP_BAR + 14
        self.tab_y = self.top_y + self.ch + self.gap * 1.5

    def col_x(self, i):
        return self.left + i * (self.cw + self.gap)

    def layout(self):
        """Decide where every card belongs (self.target) and its order."""
        self.target, self.where, self.order = {}, {}, []

        def place(kind, i, pile, x, y, fan=0):
            for k, c in enumerate(pile):
                self.target[c] = (x, y + k * fan)
                self.where[c] = (kind, i, k)
                self.order.append(c)

        place("stock", 0, self.stock, self.col_x(0), self.top_y)
        place("waste", 0, self.waste, self.col_x(1), self.top_y)
        for s, pile in enumerate(self.found):
            place("found", s, pile, self.col_x(3 + s), self.top_y)
        room = self.height - self.tab_y - self.ch - STRIP - 10
        for i, col in enumerate(self.tab):
            fan = min(0.28 * self.ch, max(15, room / max(1, len(col) - 1)))
            place("tab", i, col, self.col_x(i), self.tab_y, fan)
        # Cards changed order: fix stacking.
        self.restack = True

    def on_resize(self, e):
        self.width, self.height = e.width, e.height
        self.size()
        self.cv.delete("card")
        self.drawn = {}
        self.layout()
        self.draw_board()

    # ----------------------------------------------------------------- mouse
    def card_at(self, x, y):
        for c in reversed(self.order):
            px, py = self.pos[c]
            if px <= x <= px + self.cw and py <= y <= py + self.ch:
                return c
        return None

    def on_press(self, e):
        # Refresh buttons/statistics right away.
        self.panel_time = 0
        for action, (x1, y1, x2, y2) in self.buttons.items():
            if x1 <= e.x <= x2 and y1 <= e.y <= y2:
                return action()
        if e.x > self.width - PANEL or self.auto:
            return
        if self.won:
            return self.new_game()
        self.message = ""
        # Setup: clicks hide / show cards.
        if self.phase == "setup":
            for x1, y1, x2, y2, c in self.chips:
                if x1 <= e.x <= x2 and y1 <= e.y <= y2:
                    return self.toggle_hidden(c)
            c = self.card_at(e.x, e.y)
            if c and self.where[c][0] == "tab":
                self.toggle_hidden(c)
            return
        if (
            self.col_x(0) <= e.x <= self.col_x(0) + self.cw
            and self.top_y <= e.y <= self.top_y + self.ch
        ):
            if self.stock or self.waste:
                self.do(("draw",))
            return
        c = self.card_at(e.x, e.y)
        if not c or c in self.hidden:
            return
        kind, i, idx = self.where[c]
        if kind == "tab":
            group = self.tab[i][idx:]
        elif kind == "waste" and c == self.waste[-1]:
            group = [c]
        else:
            return
        if any(not stacks_on(b, a) for a, b in zip(group, group[1:])):
            # Only a proper run can be picked up.
            return
        if self.last_click[0] == c and time.time() - self.last_click[1] < 0.35:
            self.last_click = (None, 0)  # double-click
            mv = self.best_move(c)
            if mv:
                self.do(mv)
            return
        self.last_click = (c, time.time())
        self.drag = {"cards": group, "moved": False, "x": e.x, "y": e.y}

    def on_drag(self, e):
        d = self.drag
        if not d or (
            not d["moved"] and abs(e.x - d["x"]) + abs(e.y - d["y"]) < 6
        ):
            return
        d["moved"] = True
        for c in d["cards"]:
            self.pos[c][0] += e.x - d["x"]
            self.pos[c][1] += e.y - d["y"]
            self.cv.tag_raise(self.tag(c))
        d["x"], d["y"] = e.x, e.y

    def on_release(self, e):
        d, self.drag = self.drag, None
        if not d or not d["moved"]:
            return
        c = d["cards"][0]
        cx, cy = self.pos[c][0] + self.cw / 2, self.pos[c][1] + self.ch / 2
        col = min(
            range(7), key=lambda i: abs(cx - self.col_x(i) - self.cw / 2)
        )
        # Dropped in the top row: foundation.
        if cy < self.tab_y:
            mv = self.move_for(c, "found")
        elif abs(cx - self.col_x(col) - self.cw / 2) < self.cw * 0.8:
            mv = self.move_for(c, col)
        else:
            mv = None
        if mv:
            # Otherwise the cards slide back by themselves.
            self.do(mv)

    def move_for(self, c, dest):
        """Return the move that puts card `c` (and its run) on `dest`.

        Returns None if that move is not legal.
        dest is "found" or a column number."""
        kind, i, idx = self.where[c]
        if dest == "found":
            on_top = kind == "waste" or idx == len(self.tab[i]) - 1
            if on_top and foundation_ok(c, self.foundation_counts()):
                return ("w2f",) if kind == "waste" else ("t2f", i)
        elif fits(c, self.tab[dest]) and not (kind == "tab" and i == dest):
            return ("w2t", dest) if kind == "waste" else ("t2t", i, idx, dest)
        return None

    def best_move(self, c):
        """Pick the move for a double-click.

        Foundation first, then a column with cards, then an empty column.
        """
        kind, i, idx = self.where[c]
        # Pointless to move to an empty one.
        whole_column = kind == "tab" and idx == 0
        cols = [j for j in range(7) if self.tab[j]]
        cols += (
            [] if whole_column else [j for j in range(7) if not self.tab[j]]
        )
        for dest in ["found"] + cols:
            mv = self.move_for(c, dest)
            if mv:
                return mv
        return None

    # ------------------------------------------------------------- animation
    def tick(self):
        """Runs about 60 times a second: slide cards toward their targets."""
        now = time.time()
        dragged = set(self.drag["cards"]) if self.drag else set()
        for c in self.order:
            p, (tx, ty) = self.pos[c], self.target[c]
            if c not in dragged and now >= self.delay.get(c, 0):
                # Move 30% of the way each frame.
                p[0] += (tx - p[0]) * 0.3
                p[1] += (ty - p[1]) * 0.3
                if abs(tx - p[0]) < 0.5 and abs(ty - p[1]) < 0.5:
                    p[0], p[1] = tx, ty
            look = self.look(c, now)
            old = self.drawn.get(c)
            # Appearance changed: redraw this card.
            if not old or old[0] != look:
                self.draw_card(c, look)
                self.restack = True
            elif old[1] != tuple(p):
                # Only moved: shift the existing drawing.
                self.cv.move(self.tag(c), p[0] - old[1][0], p[1] - old[1][1])
                self.drawn[c] = (look, tuple(p))
        # Text panels: 10 times a second is plenty.
        if now - self.panel_time > 0.1:
            self.panel_time = now
            self.draw_panel()
            self.restack = True
        # Put cards, panels and dragged cards in order.
        if self.restack:
            self.restack = False
            for c in self.order + sorted(dragged, key=self.order.index):
                self.cv.tag_raise(self.tag(c))
                if c == self.order[-1]:
                    self.cv.tag_raise("ui")
        self.root.after(16, self.tick)

    # ------------------------------------------------------------- drawing
    def tag(self, c):
        return f"c{c[0]}_{c[1]}"

    def font(self, size, bold=True):
        return ("Georgia", max(7, int(size)), "bold" if bold else "normal")

    def rrect(self, x1, y1, x2, y2, r, **kw):
        pts = [
            x1 + r,
            y1,
            x2 - r,
            y1,
            x2,
            y1,
            x2,
            y1 + r,
            x2,
            y2 - r,
            x2,
            y2,
            x2 - r,
            y2,
            x1 + r,
            y2,
            x1,
            y2,
            x1,
            y2 - r,
            x1,
            y1 + r,
            x1,
            y1,
        ]
        return self.cv.create_polygon(pts, smooth=True, **kw)

    def text(self, x, y, s, color, size, bold=False, **kw):
        return self.cv.create_text(
            x, y, text=s, fill=color, font=self.font(size, bold), **kw
        )

    def look(self, c, now):
        """Return how a card should look right now.

        A card is only redrawn when this changes.
        """
        if self.where[c][0] == "stock" or now < self.delay.get(c, 0):
            return "back"
        if c in self.hidden:
            return (
                "hidden+name"
                if self.peek or self.phase == "setup"
                else "hidden"
            )
        return "face+ring" if now - self.flash.get(c, 0) < 1.5 else "face"

    def draw_card(self, c, look):
        self.cv.delete(self.tag(c))
        x, y = self.pos[c]
        cw, ch, r = self.cw, self.ch, self.cw * 0.09
        tags = ("card", self.tag(c))
        # Shadow.
        self.rrect(
            x + 2, y + 3, x + cw + 2, y + ch + 3, r, fill="#0a3324", tags=tags
        )
        self.rrect(
            x, y, x + cw, y + ch, r, fill=IVORY, outline="#bdb7a3", tags=tags
        )
        if look.startswith(("back", "hidden")):
            self.rrect(
                x + cw * 0.07,
                y + cw * 0.07,
                x + cw * 0.93,
                y + ch - cw * 0.07,
                r * 0.7,
                fill=BLUE_BACK if look == "back" else HIDDEN_BACK,
                tags=tags,
            )
            mx, my = x + cw / 2, y + ch / 2
            self.cv.create_polygon(
                mx,
                my - cw * 0.25,
                mx + cw * 0.18,
                my,
                mx,
                my + cw * 0.25,
                mx - cw * 0.18,
                my,
                fill=GOLD,
                tags=tags,
            )
            if look.startswith("hidden"):
                self.text(mx, my, "?", HIDDEN_BACK, cw * 0.22, True, tags=tags)
            if look == "hidden+name":
                self.text(
                    x + cw * 0.12,
                    y + ch * 0.04,
                    name(c),
                    "#ffd9e8",
                    cw * 0.17,
                    True,
                    anchor="nw",
                    tags=tags,
                )
        else:
            color = RED if is_red(c) else INK
            self.text(
                x + cw * 0.09,
                y + ch * 0.035,
                name(c),
                color,
                cw * 0.2,
                True,
                anchor="nw",
                tags=tags,
            )
            self.text(
                x + cw / 2,
                y + ch * 0.6,
                SUITS[c[0]],
                color,
                cw * 0.45,
                tags=tags,
            )
            if look == "face+ring":  # just revealed
                self.rrect(
                    x - 3,
                    y - 3,
                    x + cw + 3,
                    y + ch + 3,
                    r + 2,
                    fill="",
                    outline=GOLD,
                    width=4,
                    tags=tags,
                )
        self.drawn[c] = (look, (x, y))

    def draw_board(self):
        """Empty slots and border; drawn once per resize, under everything."""
        self.cv.delete("board")
        self.cv.create_rectangle(
            8,
            TOP_BAR,
            self.width - PANEL - 8,
            self.height - 8,
            outline=SLOT,
            tags="board",
        )
        slots = [
            (self.col_x(0), self.top_y, "↻"),
            (self.col_x(1), self.top_y, ""),
        ]
        slots += [(self.col_x(3 + s), self.top_y, SUITS[s]) for s in range(4)]
        slots += [(self.col_x(i), self.tab_y, "K") for i in range(7)]
        for x, y, glyph in slots:
            self.rrect(
                x,
                y,
                x + self.cw,
                y + self.ch,
                self.cw * 0.09,
                fill="",
                outline=SLOT,
                width=2,
                tags="board",
            )
            self.text(
                x + self.cw / 2,
                y + self.ch / 2,
                glyph,
                SLOT,
                self.cw * 0.4,
                tags="board",
            )
        self.cv.tag_lower("board")

    def draw_panel(self):
        """Draw the toolbar, stock strip and statistics panel.

        These are text only, so they are cheap to redraw.
        """
        cv = self.cv
        cv.delete("ui")
        ui = {"tags": "ui"}
        # --- toolbar
        cv.create_rectangle(
            0, 0, self.width, TOP_BAR - 6, fill=BAR, outline="", **ui
        )
        self.text(
            16, 24, "Thoughtful Solitaire", GOLD, 19, True, anchor="w", **ui
        )
        if self.phase == "setup":
            items = [
                ("New game", self.new_game),
                ("Start solver", self.start_solver),
                ("Play myself", lambda: setattr(self, "phase", "play")),
                ("Clear", self.hidden.clear),
                (f"Random {RANDOM_HIDE}", self.random_hide),
            ]
        elif self.auto and self.run and not self.run["result"]:
            items = [("New game", self.new_game), ("Stop", self.stop_solver)]
        else:
            items = [
                ("New game", self.new_game),
                ("Undo", self.undo),
                ("Peek: " + ("on" if self.peek else "off"), self.toggle_peek),
            ]
            items += (
                [] if self.won or self.auto else [("Solve", self.start_solver)]
            )
        self.buttons, x = {}, self.width - 12
        for label, action in items:  # drawn right to left
            w = 24 + 9 * len(label)
            gold = label in ("Solve", "Start solver") or label.startswith(
                "Random"
            )
            self.rrect(
                x - w, 9, x, 39, 13, fill=GOLD if gold else "#1b6a4a", **ui
            )
            self.text(
                x - w / 2,
                24,
                label,
                "#2a2108" if gold else IVORY,
                11,
                True,
                **ui,
            )
            self.buttons[action] = (x - w, 9, x, 39)
            x -= w + 8
        game_time = (
            ((self.clock_end or time.time()) - self.clock_start)
            if self.clock_start
            else 0
        )
        self.text(
            x - 10,
            24,
            f"{self.moves} moves     {fmt_time(game_time)[:-2]}",
            IVORY,
            12,
            anchor="e",
            **ui,
        )

        # --- stock strip: the whole stock, next card first
        y0 = self.height - STRIP + 4
        self.text(
            self.left,
            y0 + 2,
            (
                "Stock order (next card first)"
                if self.stock
                else "Stock is empty"
            ),
            GOLD,
            11,
            True,
            anchor="nw",
            **ui,
        )
        self.chips, x = [], self.left
        w = min(
            46,
            (self.width - PANEL - 12 - self.left) / max(1, len(self.stock))
            - 4,
        )
        for c in reversed(self.stock):
            hid = c in self.hidden
            show = not hid or self.peek or self.phase == "setup"
            self.rrect(
                x,
                y0 + 22,
                x + w,
                y0 + 46,
                5,
                fill=HIDDEN_BACK if hid else IVORY,
                **ui,
            )
            self.text(
                x + w / 2,
                y0 + 34,
                name(c) if show else "?",
                "#ffd9e8" if hid else (RED if is_red(c) else INK),
                min(11, w * 0.36),
                True,
                **ui,
            )
            self.chips.append((x, y0 + 22, x + w, y0 + 46, c))
            x += w + 4

        # --- statistics panel
        x0, right = self.width - PANEL, self.width - 18
        cv.create_rectangle(
            x0,
            TOP_BAR - 6,
            self.width,
            self.height,
            fill=PANEL_BG,
            outline="",
            **ui,
        )
        y = [TOP_BAR + 8]

        def line(
            s, color=IVORY, size=9, bold=False, value=None, value_color=IVORY
        ):
            item = self.text(
                x0 + 18,
                y[0],
                s,
                color,
                size,
                bold,
                anchor="nw",
                width=PANEL - 36,
                **ui,
            )
            if value is not None:
                self.text(
                    right,
                    y[0],
                    value,
                    value_color,
                    10,
                    True,
                    anchor="ne",
                    **ui,
                )
            y[0] = cv.bbox(item)[3] + 3

        def heading(s):
            y[0] += 8
            line(s, GOLD, 11, True)

        run = self.run
        home = sum(self.foundation_counts())
        heading("SOLVER STATISTICS")
        if self.phase == "setup":
            line("SETUP", GOLD, 16, True)
        elif not run:
            line(
                "SOLVED" if self.won else "PLAYING BY HAND",
                GREEN if self.won else IVORY,
                16,
                True,
            )
        else:
            state = {
                None: ("RUNNING", GOLD),
                "solved": ("SOLVED", GREEN),
                "stopped": ("STOPPED", PINK),
            }
            line(*state[run["result"]], 16, True)
        if self.status or self.message:
            line(self.message or self.status, MUTED)
        if run:
            elapsed = fmt_time((run["end"] or time.time()) - run["start"])
            if run["result"] == "solved":
                line("Time to solve", MUTED, value=elapsed, value_color=GREEN)
                line("Solved at", MUTED, value=run["at"])
            elif run["result"]:
                line(
                    "Time until stopped",
                    MUTED,
                    value=elapsed,
                    value_color=PINK,
                )
                line("Stopped at", MUTED, value=run["at"])
            else:
                line("Elapsed", MUTED, value=elapsed, value_color=GOLD)
            line(
                "Moves by solver", MUTED, value=str(self.moves - run["moves"])
            )
        line("Moves (whole game)", MUTED, value=str(self.moves))
        line(
            "Cards on foundations",
            MUTED,
            value=f"{home}/52",
            value_color=GREEN if home == 52 else IVORY,
        )
        if run:
            line("Hidden at start", MUTED, value=str(run["hidden"]))
            line(
                "Revealed / still hidden",
                MUTED,
                value=f"{run['revealed']} / {len(self.hidden)}",
            )
            line("Plans made", MUTED, value=str(run["plans"]))
            line("Positions searched", MUTED, value=f"{run['nodes']:,}")
            line("Thinking time", MUTED, value=f"{run['think']:.1f}s")
        else:
            line("Hidden cards", MUTED, value=str(len(self.hidden)))

        if self.phase == "setup":
            heading("SETUP")
            line(
                "Click any card that is not on top of a column (or a stock "
                "chip at the bottom) to hide it. Then press Start solver or "
                "Play myself.",
                MUTED,
            )
        if run and run["result"] == "stopped":
            heading("WHY IT STOPPED")
            line(run["headline"], PINK, 11, True)
            for reason in run["why"]:
                line("• " + reason)
        if self.reveals:
            heading("REVEALS")
            for r in self.reveals[-6:]:
                line(r)
        if self.history:
            heading("HISTORY")
            wins = sum(h["result"] == "solved" for h in self.history)
            line(f"{wins} of {len(self.history)} runs solved", MUTED)
            for h in self.history[-5:][::-1]:
                ok = h["result"] == "solved"
                line(
                    f"Game {h['game']}: {'Solved' if ok else 'Stopped'}, "
                    f"{h['moves']} moves, {fmt_time(h['time'])}, "
                    f"{h['home']}/52, hidden {h['hidden']} "
                    f"({h['revealed']} revealed)"
                    + ("" if ok else f" - {h['reason']}"),
                    GREEN if ok else PINK,
                )

        if self.won:  # win banner
            cx, cy = (self.width - PANEL) / 2, self.height / 2
            self.rrect(
                cx - 220,
                cy - 80,
                cx + 220,
                cy + 80,
                26,
                fill=IVORY,
                outline=GOLD,
                width=3,
                **ui,
            )
            self.text(cx, cy - 30, "Solved!", FELT, 38, True, **ui)
            self.text(
                cx,
                cy + 20,
                f"{self.moves} moves - click the table to play again",
                INK,
                13,
                **ui,
            )


if __name__ == "__main__":
    root = tk.Tk()
    Solitaire(root)
    root.mainloop()
