"""Hidden cards for Thoughtful Solitaire.

Part 2 of 3 of the project:
  optimal_solver.py  card rules, moves and the search (A* and IDA*)
  hidden_cards.py    hidden cards: uncover search, solve() and game side
  ui.py              the game window (run this file)

"""

import random
import time

from optimal_solver import (
    SOLVE_SECONDS,
    astar,
    check_plan,
    check_state,
    estimate_win,
    fmt_time,
    ida_star,
    is_hidden,
    is_won,
    name,
    stacks_on,
)

# ----- settings you can change -----
RANDOM_HIDE = 3  # cards hidden by the "Random" button
REVEAL_SECONDS = 10  # thinking time to find a way to uncover a hidden card


def uncovers(state):
    """Is a hidden card now on top of a column, or just drawn?"""
    tab, fnd, stock, waste = state
    return any(col and is_hidden(col[-1]) for col in tab + (waste,))


def estimate_uncover(state):
    """Lower bound on moves to uncover any hidden card."""
    tab, fnd, stock, waste = state
    best = 99
    for col in tab:
        for i, c in enumerate(col):
            if is_hidden(c):  # every run on top of it needs its own move
                above = col[i + 1:]
                runs = 1 + sum(
                    not stacks_on(b, a) for a, b in zip(above, above[1:])
                )
                best = min(best, runs)
    for i, c in enumerate(stock):
        if is_hidden(c):  # draws needed to reach it
            best = min(best, len(stock) - i)
    return best


def solve(state):
    """Choose what the solver plays next.  Returns a dict with path, status,
    label, nodes and progress (see astar).  status is 'found', 'blocked'
    (hidden cards can't be uncovered), 'dead_end' (no win exists) or 'limit'.
    """
    check_state(state)
    if any(is_hidden(c) for col in state[0] + (state[2],) for c in col):
        r = astar(state, uncovers, estimate_uncover, 1.5, REVEAL_SECONDS)
        r["status"] = {"found": "found", "done": "blocked", "limit": "limit"}[
            r["status"]
        ]
        r["label"] = "uncover"
        if r["path"]:
            check_plan(state, r["path"], uncovers)
        else:
            check_plan(state, r["progress"])
        return r

    end = time.time() + SOLVE_SECONDS
    nodes, best = 0, None
    # Different weights suit different deals.
    for weight in (3, 6, 2, 10):
        left = end - time.time()
        if left < 1:
            break
        r = astar(state, is_won, estimate_win, weight, min(6, left))
        nodes += r["nodes"]
        if best is None or r["score"] > best["score"]:
            best = r
        if r["path"]:
            break
        # Checked everything: there is no win.
        if r["status"] == "done":
            check_plan(state, r["progress"])
            return dict(r, status="dead_end", nodes=nodes, label="")
    if not r["path"]:
        check_plan(state, best["progress"])
        return dict(best, status="limit", nodes=nodes, label="")

    # Try to find a shorter plan with IDA*.
    path, label = r["path"], "best found"
    if end - time.time() > 0.5:
        shorter, status = ida_star(state, len(path) - 1, end - time.time())
        if shorter:
            path, label = shorter, "optimal"
        elif status == "none":
            label = "optimal"
    check_plan(state, path, is_won)
    return {
        "path": path,
        "status": "found",
        "label": label,
        "nodes": nodes,
        "progress": [],
    }


class HiddenCardsMixin:
    """Game-window methods for hidden cards (used by ui.Solitaire)."""

    # ---------------------------------------------------------- hidden cards
    def flip_uncovered(self):
        """Flip hidden cards now on top of a column or just drawn."""
        for where, pile in [
            (f"column {i + 1}", p) for i, p in enumerate(self.tab)
        ] + [("drawn from stock", self.waste)]:
            if pile and pile[-1] in self.hidden:
                c = pile[-1]
                self.hidden.discard(c)
                self.flash[c] = time.time()
                run = self.run if self.run and not self.run["result"] else None
                start = run["start"] if run else self.clock_start
                self.reveals.append(
                    f"{fmt_time(time.time() - start)}  move {self.moves}:  "
                    f"{name(c)}  ({where})"
                )
                if run:
                    run["revealed"] += 1

    def toggle_hidden(self, c):
        kind, i, idx = self.where[c]
        if c in self.hidden:
            self.hidden.discard(c)
        elif kind == "stock" or (kind == "tab" and idx < len(self.tab[i]) - 1):
            self.hidden.add(c)
        else:
            self.message = (
                "Top cards can't be hidden - they would flip straight away."
            )

    def random_hide(self):
        # Every card except the tops.
        cards = [c for col in self.tab for c in col[:-1]]
        assert 0 <= RANDOM_HIDE <= len(cards), "RANDOM_HIDE is too large"
        self.hidden = set(random.sample(cards, RANDOM_HIDE))

    def toggle_peek(self):
        self.peek = not self.peek

    def solver_view(self):
        """The board as the solver sees it: hidden cards replaced by blanks."""
        blank = {c: (-1, 100 + n) for n, c in enumerate(self.hidden)}

        def see(pile):
            return tuple(blank.get(c, c) for c in pile)

        return (
            tuple(see(p) for p in self.tab),
            self.foundation_counts(),
            see(self.stock),
            see(self.waste),
        )
