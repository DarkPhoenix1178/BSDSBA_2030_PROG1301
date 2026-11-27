"""Optimal solver for Thoughtful Solitaire.

Part 1 of 3 of the project:
  optimal_solver.py  card rules, moves and the search (A* and IDA*)
  hidden_cards.py    hidden cards: uncover search, solve() and game side
  ui.py              the game window (run this file)

The code in this file is unchanged from the single-file version; it was
only moved here.
"""

import heapq
import itertools
import time

# ----- settings you can change -----
SOLVE_SECONDS = 20  # thinking time for a full solve

SUITS = "♠♥♦♣"
RANKS = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]


# =============================================================================
#  SOLVER
#  A card is (suit, rank): suit 0-3 = ♠♥♦♣, rank 1-13 = A..K.
#  A hidden card is (-1, 100 + n): the solver knows a card is there, not which.
#  A state is (tab, fnd, stock, waste), all tuples:
#     tab   = 7 columns, each listed bottom -> top
#     fnd   = how many cards are on each suit's foundation
#     stock = last card is drawn next      waste = last card is on top
#  Moves: ("draw",) ("w2f",) ("w2t", col) ("t2f", col) ("t2t", from, index, to)
# =============================================================================


def is_red(c):
    return c[0] in (1, 2)


def is_hidden(c):
    return c[0] < 0


def name(c):
    return f"{RANKS[c[1]]}{SUITS[c[0]]}"


def stacks_on(card, below):
    """Can `card` sit on `below` in the tableau? (one rank lower, other colour)
    Hidden cards have rank 100+, so they never match anything here."""
    return below[1] == card[1] + 1 and (card[0] in (1, 2)) != (
        below[0] in (1, 2)
    )


def fits(card, col):
    """Can `card` be placed on this column?  Empty columns only take kings."""
    if col:
        return stacks_on(card, col[-1])
    return card[1] == 13


def foundation_ok(card, fnd):
    return not is_hidden(card) and fnd[card[0]] == card[1] - 1


def always_safe(card, fnd):
    """Sending this card home can never hurt.

    True when no card of the other colour still needs it to stack on.
    """
    if not foundation_ok(card, fnd):
        return False
    other = (0, 3) if is_red(card) else (1, 2)
    return card[1] <= 2 or all(fnd[s] >= card[1] - 1 for s in other)


def legal_moves(state):
    tab, fnd, stock, waste = state
    # A safe foundation move is always played first; nothing else is
    # considered.
    if waste and always_safe(waste[-1], fnd):
        return [("w2f",)]
    for i, col in enumerate(tab):
        if col and always_safe(col[-1], fnd):
            return [("t2f", i)]

    moves = []
    if waste:
        if foundation_ok(waste[-1], fnd):
            moves.append(("w2f",))
        moves += [
            ("w2t", j) for j, col in enumerate(tab) if fits(waste[-1], col)
        ]
    for i, col in enumerate(tab):
        if not col:
            continue
        if foundation_ok(col[-1], fnd):
            moves.append(("t2f", i))
        start = len(col) - 1  # where the movable run begins
        while start > 0 and stacks_on(col[start], col[start - 1]):
            start -= 1
        for k in range(start, len(col)):
            tried_empty = False
            for j, dest in enumerate(tab):
                if j == i or not fits(col[k], dest):
                    continue
                # Empty columns are all alike: try one, and never move a
                # whole column to one.
                if not dest:
                    if k == 0 or tried_empty:
                        continue
                    tried_empty = True
                moves.append(("t2t", i, k, j))
    if stock or waste:
        moves.append(("draw",))
    return moves


def is_legal(state, mv):
    """Return True if move `mv` follows the rules in `state`.

    Unlike legal_moves(), this ignores the "safe move first" shortcut, so
    it also works for moves made by the player.
    """
    tab, fnd, stock, waste = state
    kind = mv[0]
    if kind == "draw":
        return bool(stock or waste)
    if kind == "w2f":
        return bool(waste) and foundation_ok(waste[-1], fnd)
    if kind == "w2t":
        return bool(waste) and fits(waste[-1], tab[mv[1]])
    if kind == "t2f":
        col = tab[mv[1]]
        return bool(col) and foundation_ok(col[-1], fnd)
    if kind == "t2t":
        _, i, k, j = mv
        run = tab[i][k:]
        return (
            i != j
            and bool(run)
            and fits(run[0], tab[j])
            and all(stacks_on(b, a) for a, b in zip(run, run[1:]))
        )
    return False


def check_state(state):
    """Assert that a solver state is well formed.

    Every card (visible or hidden) must appear exactly once, and the
    foundations must hold between 0 and 13 cards each.
    """
    tab, fnd, stock, waste = state
    assert len(tab) == 7, "there must be 7 tableau columns"
    assert len(fnd) == 4, "there must be 4 foundations"
    assert all(0 <= n <= 13 for n in fnd), "foundation count out of range"
    cards = [c for col in tab for c in col] + list(stock) + list(waste)
    assert (
        len(cards) + sum(fnd) == 52
    ), f"expected 52 cards, found {len(cards) + sum(fnd)}"
    assert len(set(cards)) == len(cards), "a card appears twice"


def check_plan(state, path, goal=None):
    """Assert that every move in `path` is legal and that it reaches `goal`.

    Used on every plan the solver returns, so a search bug can never make
    the game play an illegal move.
    """
    for number, mv in enumerate(path, start=1):
        assert is_legal(state, mv), f"move {number} of the plan is illegal"
        state = play(state, mv)
    if goal is not None:
        assert goal(state), "the plan does not reach its goal"
    check_state(state)


def play(state, mv):
    """Return the new state after move `mv` (the old state is not changed)."""
    assert is_legal(state, mv), f"illegal move: {mv}"
    tab, fnd, stock, waste = state
    tab, fnd = list(tab), list(fnd)
    kind = mv[0]
    if kind == "draw":
        if stock:
            stock, waste = stock[:-1], waste + stock[-1:]
        else:
            # Turn the waste over into a new stock.
            stock, waste = waste[::-1], ()
    elif kind == "w2f":
        fnd[waste[-1][0]] += 1
        waste = waste[:-1]
    elif kind == "w2t":
        tab[mv[1]] += waste[-1:]
        waste = waste[:-1]
    elif kind == "t2f":
        fnd[tab[mv[1]][-1][0]] += 1
        tab[mv[1]] = tab[mv[1]][:-1]
    else:
        _, i, k, j = mv
        tab[j] += tab[i][k:]
        tab[i] = tab[i][:k]
    return tuple(tab), tuple(fnd), stock, waste


def key(state):
    """Positions that differ only in column order count as the same."""
    tab, fnd, stock, waste = state
    return tuple(sorted(tab)), fnd, stock, waste


def is_won(state):
    return sum(state[1]) == 52


def estimate_win(state):
    """Lower bound on moves left to win.

    It is never too high, so A* and IDA* stay correct.
    """
    tab, fnd, stock, waste = state
    # Each card needs a move home; stock cards also need a draw.
    h = 52 - sum(fnd) + len(stock)
    # A higher card above a lower one of the same suit needs one extra
    # tableau move to get out of the way.
    for col in tab:
        lowest = [99] * 5  # index -1 = the slot used by hidden cards
        for suit, rank in col:
            if rank > lowest[suit]:
                h += 1
                break
            lowest[suit] = min(rank, lowest[suit])
    return h


def moves_from(node):
    """Turn a search node into the list of moves that led to it.

    Search nodes are (move, parent node) pairs, so walk back to the start.
    """
    moves = []
    while node:
        mv, node = node
        moves.append(mv)
    return moves[::-1]


def astar(start, goal, estimate, weight, seconds, max_nodes=1_500_000):
    """Weighted A*: always look next at the position with the smallest
    moves_so_far + weight * estimate.  Returns a dict with
      path     : moves to reach `goal`, or None
      status   : 'found', 'done' (every reachable position checked) or 'limit'
      progress : moves to the position with the most cards on the foundations
      nodes    : positions checked"""
    assert weight >= 1, "weights below 1 only slow the search down"
    assert seconds > 0, "the search needs some time to think"
    assert max_nodes > 0, "max_nodes must be positive"
    deadline = time.time() + seconds
    tie = itertools.count()
    best_g = {key(start): 0}
    heap = [(0, next(tie), 0, start, key(start), None)]
    # best = (foundation cards, -moves, node)
    best = (sum(start[1]), 0, None)
    nodes, status = 0, "done"
    while heap:
        _, _, g, s, k, node = heapq.heappop(heap)
        # Already reached in fewer moves.
        if best_g[k] < g:
            continue
        nodes += 1
        if (sum(s[1]), -g) > best[:2]:
            best = (sum(s[1]), -g, node)
        if nodes > max_nodes or (nodes % 1000 == 0 and time.time() > deadline):
            status = "limit"
            break
        for mv in legal_moves(s):
            ns = play(s, mv)
            if goal(ns):
                return {
                    "path": moves_from((mv, node)),
                    "status": "found",
                    "progress": [],
                    "score": 52,
                    "nodes": nodes,
                }
            nk = key(ns)
            if best_g.get(nk, 1 << 30) <= g + 1:
                continue
            best_g[nk] = g + 1
            heapq.heappush(
                heap,
                (
                    g + 1 + weight * estimate(ns),
                    next(tie),
                    g + 1,
                    ns,
                    nk,
                    (mv, node),
                ),
            )
    return {
        "path": None,
        "status": status,
        "progress": moves_from(best[2]),
        "score": best[0],
        "nodes": nodes,
    }


class OutOfTimeError(Exception):
    """Raised inside IDA* when the thinking time runs out."""


def ida_star(start, max_moves, seconds):
    """Iterative-Deepening A*: a depth-first search with a move budget.

    A line is dropped when moves_so_far + estimate > budget; if nothing is
    found the budget grows to the smallest dropped value and the search
    starts again. Returns (path, status) with status 'found', 'none'
    (nothing within max_moves) or 'limit'.
    """
    assert max_moves >= 0, "max_moves cannot be negative"
    assert seconds > 0, "the search needs some time to think"
    deadline = time.time() + seconds
    count = [0]

    def dfs(s, g, budget, path, seen):
        count[0] += 1
        if count[0] % 1000 == 0 and time.time() > deadline:
            raise OutOfTimeError
        smallest_dropped = float("inf")
        for mv in legal_moves(s):
            ns = play(s, mv)
            if is_won(ns):
                path.append(mv)
                return True
            f = g + 1 + estimate_win(ns)
            if f > budget:
                smallest_dropped = min(smallest_dropped, f)
                continue
            k = key(ns)
            if seen.get(k, 1 << 30) <= g + 1:
                continue
            seen[k] = g + 1
            path.append(mv)
            result = dfs(ns, g + 1, budget, path, seen)
            if result is True:
                return True
            path.pop()
            smallest_dropped = min(smallest_dropped, result)
        return smallest_dropped

    budget = estimate_win(start)
    try:
        while budget <= max_moves:
            path = []
            result = dfs(start, 0, budget, path, {key(start): 0})
            if result is True:
                assert len(path) <= max_moves, "IDA* went over its budget"
                return path, "found"
            budget = result  # inf when nothing was dropped
    except OutOfTimeError:
        return None, "limit"
    return None, "none"


# Shared helper, also used by the game window.
def fmt_time(seconds):
    """Format seconds as m:ss.s, for example 1:05.3."""
    assert seconds >= 0, "time cannot be negative"
    return f"{int(seconds // 60)}:{seconds % 60:04.1f}"
