# Thoughtful Solitaire

**Team:** Facto, Gochuico, Mughal, Oliva  
**Course:** [Course name / section]

## Overview
Thoughtful Solitaire is Klondike solitaire with every card face up, so the whole game can be planned like a search problem. A solver finds a winning line of moves. We then hide some cards from the solver to test how it behaves with missing information.

The project explores how a search algorithm plans when it cannot see the whole board.

## Requirements
- Play Klondike solitaire (draw 1 card, unlimited passes through the stock) in a window.
- Solve a full-information game with a search algorithm.
- Hide chosen or random cards from the solver only.
- Reveal hidden cards by playing, then re-plan.
- Explain why the solver stopped when it cannot continue.

## Run
Requires Python 3.9 or newer. Tkinter ships with the standard Python installers (on some Linux systems install `python3-tk`). No other packages are needed.

Keep the three files in one folder, then:

```bash
python ui.py
```

## Controls
| Action | How |
| --- | --- |
| Hide or show a card (setup) | Click a column card or stock chip |
| Hide 3 random cards | **Random** button |
| Start the solver | **Start solver** / **Solve**, or press `S` |
| Play by hand | **Play myself** |
| Move a card or run | Drag it |
| Send a card to its best spot | Double-click it |
| Draw / recycle the stock | Click the stock |
| Undo | `Ctrl+Z` / `Cmd+Z` |
| Peek at hidden cards | `P` |
| New game | `N` |

## How it works
| File | Job |
| --- | --- |
| `ui.py` | Game window (Tkinter): drawing, mouse input, animation, statistics panel |
| `hidden_cards.py` | Hidden cards, the uncover search, and `solve()`, which picks the search |
| `optimal_solver.py` | Card rules, legal moves, the heuristic, A* and IDA* |

Dependencies point one way: `ui.py` uses `hidden_cards.py`, which uses `optimal_solver.py`.
1. The board is a tuple `(tableau, foundations, stock, waste)`. A move never changes it; it builds a new one.
2. If **no card is hidden**, the solver runs weighted A* (weights 3, 6, 2, 10) for a fast plan, then IDA* to look for a shorter one (20 s budget).
3. If **cards are hidden**, `solver_view()` replaces each with a blank the solver cannot move. The solver searches for the shortest line that uncovers one, plays it, learns the card, and plans again.
4. The search runs in a background thread so the window stays responsive.
5. Every plan is replayed and checked (`check_plan`) before it is played.

If the solver cannot continue, it stops and the side panel says why: `blocked`, `dead_end` or `limit`.

## Results (preliminary)

- 24 random deals, no hidden cards, 10 s budget: 18 full plans (75%), 6 hit the time limit, plans of 111 to 139 moves.
- Hiding 0 to 8 cards, 30 deals per level, 4 s budget per search: win rate stayed between 33% and 43%. Hiding cards did not clearly lower it, but it caused more re-planning, longer plans and occasional "blocked" stops.

Small samples and short time budgets; treat as indicative, not final.

## Knowledge-Sharing Presentation

Explain and demonstrate:

- How solitaire becomes a search problem (states, moves, goal).
- How weighted A*, IDA* and the heuristic work, and why they were chosen over BFS, DFS and MCTS.
- How the solver handles hidden cards by uncovering and re-planning.
- A live demo: solving a full game, then a game with hidden cards.

## Limitations

- "Optimal" is only claimed when IDA* finishes within the time budget.
- The solver reveals the cheapest hidden card, not the most useful, and ignores probabilities.
- The shuffle is unseeded, so runs differ (add `random.seed(n)` to reproduce).
- No automated tests yet.

## Division of Labor

| Member | Responsibilities |
| --- | -- |
| Facto | [solver: A*, IDA*, heuristic, performance analysis (excel)] |
| Gochuico | [hidden cards, slides, experiment, README, performance analysis (excel)] |
| Mughal | [experiments, slides, performance analysis (excel)] |
| Oliva | [UI, animation, slides, experiment, performance analysis (excel)] |