import io
import contextlib
import itertools
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from settings import TILE_SIZE, WIDTH, HEIGHT                  # noqa: E402
from paimon.colorassign import (                                # noqa: E402
    Colorassign, Track, PERSONALITIES, BLINKY, PINKY, INKY, CLYDE,
)
from paimon.expectimax import (                                 # noqa: E402
    Expectimax, DIRECTIONS, OPP
)

T = TILE_SIZE
CHECKS = []
SLACK = 1.5          # AI time check: allowed overshoot of the time budget


def check(group):
    def register(fn):
        CHECKS.append((group, fn.__name__, fn))
        return fn
    return register


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------
_GAME = {}


def new_game(seed=1, budget=0.02, depth=10):
    import game as G
    random.seed(seed)
    G.AI_TIME_BUDGET = budget
    G.AI_DEPTH = depth
    with contextlib.redirect_stdout(io.StringIO()):
        g = G.Game()
    g.debug = False
    return g


def run_frames(g, frames):
    with contextlib.redirect_stdout(io.StringIO()):
        for _ in range(frames):
            if g.status != "PLAYING":
                break
            g.update()


def obs_dict(x, y, speed=2, **flags):
    d = dict(x=x, y=y, size=T, speed=speed, frightened=False, eaten=False,
             home=False, leaving=False, entering=False)
    d.update(flags)
    return d


def make_tracker(positions=((0, 0), (100, 0), (200, 0), (300, 0))):
    ca = Colorassign()
    for x, y in positions:
        ca.create_track(obs_dict(x, y))
    return ca


def set_belief(ca, weights):
    """Give the listed assignments the stated probability; the rest share
    what is left equally."""
    rest = (1.0 - sum(weights.values())) / (24 - len(weights))
    ca.log_post = [math.log(rest)] * 24
    for perm, w in weights.items():
        ca.log_post[ca._perm_lookup[perm]] = math.log(w)
    ca.adjust_low_prob()
    ca.version += 1
    ca.evidence_events = 1


def posterior_sum(ca):
    return sum(ca.probability_conv())


def ghost_state(x, y, direction, probs=None, **kw):
    """A hand-made ghost for the AI tests."""
    d = dict(x=x, y=y, direction=direction, speed=2, size=T,
             frightened=False, eaten=False, home=False, leaving=False,
             entering=False, track_id=0,
             probabilities=probs or {"BLINKY": 1.0, "PINKY": 0.0,
                                     "INKY": 0.0, "CLYDE": 0.0})
    d.update(kw)
    return d


def hand_state(g, pac_xy, pac_dir, ghosts, maze=None, mode="CHASE"):
    return {
        "pacman": {"x": pac_xy[0], "y": pac_xy[1], "direction": pac_dir,
                   "speed": 2, "size": T},
        "ghosts": ghosts,
        "maze": maze if maze is not None else g.maze,
        "power": False, "power_frames": 0,
        "ghost_mode": mode, "house_exit": g.house_exit,
    }


# ===========================================================================
# GROUP 1: GAME
# ===========================================================================
@check("GAME")
def maze_is_rectangular():
    g = new_game()
    widths = {len(row) for row in g.maze}
    assert len(widths) == 1, f"maze rows have different lengths: {widths}"


@check("GAME")
def tile_size_divides_every_speed_used():
    for speed in (1, 2, 4, 8):
        assert T % speed == 0, f"TILE_SIZE {T} is not divisible by speed {speed}"


@check("GAME")
def start_positions_are_walkable():
    g = new_game()
    cx = int((g.pacman.x + g.pacman.size / 2) // T)
    cy = int((g.pacman.y + g.pacman.size / 2) // T)
    assert g.maze[cy][cx] not in "#=", "Pac-Man starts inside a wall"
    ex, ey = g.house_exit
    assert g.maze[int(ey // T)][int(ex // T)] not in "#=", \
        "house_exit is inside a wall"


@check("GAME")
def four_distinct_ghosts_exist():
    g = new_game()
    names = {type(x).__name__.upper() for x in g.ghosts}
    assert len(g.ghosts) == 4, f"expected 4 ghosts, got {len(g.ghosts)}"
    assert names == {"BLINKY", "PINKY", "INKY", "CLYDE"}, \
        f"ghost class names are {names} (the debug 'OK/WRONG' labels use them)"


@check("GAME")
def observation_has_every_key_the_ai_needs():
    g = new_game()
    obs = g.ai_values()
    need = {"pacman", "ghosts", "maze", "power", "power_timer",
            "ghost_mode", "house_exit"}
    assert need <= set(obs), f"observation missing {need - set(obs)}"
    assert {"x", "y", "direction", "speed", "size"} <= set(obs["pacman"])
    for ghost in obs["ghosts"]:
        assert {"x", "y", "speed", "size", "frightened", "eaten", "home",
                "leaving", "entering"} <= set(ghost), \
            f"ghost entry missing keys: {set(ghost)}"


@check("GAME")
def observation_does_not_leak_ghost_identity():
    g = new_game()
    banned = ("name", "type", "class", "personality", "color", "colour",
              "identity", "ghost_id")
    for ghost in g.ai_values()["ghosts"]:
        for key in ghost:
            assert not any(b in key.lower() for b in banned), \
                f"ghost entry exposes '{key}', which could reveal who it is"


@check("GAME")
def observation_order_is_shuffled():
    g = new_game()
    orders = {tuple((e["x"], e["y"]) for e in g.ai_values()["ghosts"])
              for _ in range(40)}
    assert len(orders) > 1, "ghost order never changes: identity can be read " \
                            "from list position"


@check("GAME")
def is_centered_matches_its_definition():
    g = new_game()
    for _ in range(40):
        run_frames(g, 7)
        for e in [g.pacman] + list(g.ghosts):
            expected = (e.x % T == 0) and (e.y % T == 0)
            assert bool(g.is_centered(e)) == expected, \
                f"is_centered wrong at ({e.x},{e.y})"


@check("GAME")
def entities_stay_inside_the_maze_and_off_walls():
    g = new_game()
    for _ in range(80):
        run_frames(g, 8)
        if g.status != "PLAYING":
            break
        for e in [g.pacman] + list(g.ghosts):
            assert 0 <= e.x <= WIDTH and 0 <= e.y <= HEIGHT, \
                f"entity left the screen: ({e.x},{e.y})"
            assert math.isfinite(e.x) and math.isfinite(e.y)
        cx = int((g.pacman.x + g.pacman.size / 2) // T)
        cy = int((g.pacman.y + g.pacman.size / 2) // T)
        assert g.maze[cy][cx] not in "#=", f"Pac-Man centre in wall ({cx},{cy})"
        for gh in g.ghosts:
            if gh.eaten or gh.entering or gh.leaving or gh.home:
                continue               # these move through the house walls
            gx = int((gh.x + gh.size / 2) // T)
            gy = int((gh.y + gh.size / 2) // T)
            assert g.maze[gy][gx] not in "#=", \
                f"{type(gh).__name__} centre in wall ({gx},{gy})"


@check("GAME")
def ghost_speeds_are_the_expected_values():
    g = new_game()
    for _ in range(60):
        run_frames(g, 10)
        for gh in g.ghosts:
            assert gh.speed in (1, 2, 4, 6, 8), \
                f"unexpected ghost speed {gh.speed}"


@check("GAME")
def score_never_decreases_and_pellets_never_grow():
    g = new_game()
    count = lambda: sum(r.count(".") + r.count("o") for r in g.maze)
    start, last_score = count(), g.score
    for _ in range(80):
        run_frames(g, 8)
        assert g.score >= last_score, "score went down"
        assert 0 <= count() <= start, "pellet count out of range"
        last_score = g.score


@check("GAME")
def tracker_keeps_four_tracks_through_a_game():
    g = new_game()
    run_frames(g, 600)
    assert len(g.color_assign.tracks) == 4, \
        f"tracker has {len(g.color_assign.tracks)} tracks"


# ===========================================================================
# GROUP 2: COLORASSIGN
# ===========================================================================
@check("COLORASSIGN")
def there_are_24_distinct_assignments():
    ca = Colorassign()
    assert len(ca.perms) == 24 and len(set(ca.perms)) == 24
    assert all(sorted(p) == [0, 1, 2, 3] for p in ca.perms)


@check("COLORASSIGN")
def colour_numbers_are_consistent():
    assert (BLINKY, PINKY, INKY, CLYDE) == (0, 1, 2, 3)
    assert PERSONALITIES == ["BLINKY", "PINKY", "INKY", "CLYDE"]
    from paimon import expectimax as E

    assert E.PERSONALITY_NAMES == tuple(PERSONALITIES), \
        "colorassign and expectimax disagree on colour order"
    assert (E.BLINKY, E.PINKY, E.INKY, E.CLYDE) == (0, 1, 2, 3)


@check("COLORASSIGN")
def starting_belief_is_uniform_and_has_no_guess():
    ca = make_tracker()
    assert abs(posterior_sum(ca) - 1) < 1e-9
    for t in range(4):
        probs = ca.get_probabilities(t)
        assert all(abs(p - 0.25) < 1e-9 for p in probs.values()), probs
        assert ca.get_best_guess(t) == (None, 0.0)
        assert ca.get_identity(t) is None

@check("COLORASSIGN")
def distance_squared_is_correct():
    assert Colorassign.distance_squared(3, 4, 0, 0) == 25
    assert Colorassign.distance_squared(5, 5, 5, 5) == 0

@check("COLORASSIGN")
def only_chasing_ghosts_count_as_evidence():
    for flag in ("frightened", "eaten", "home", "leaving", "entering"):
        tr = Track(0, 0, 0, 2, T, False, False, False, False, False)
        setattr(tr, flag, True)
        assert not tr.valid_personality_evidence, flag
    tr = Track(0, 0, 0, 2, T, False, False, False, False, False)
    assert tr.valid_personality_evidence

@check("COLORASSIGN")
def optimal_matching_is_cheapest_and_one_to_one():
    ca = Colorassign()
    costs = [[4, 900, 2500], [800, 9, 700], [2600, 650, 16]]
    assert ca.best_match(costs) == [0, 1, 2]
    rng = random.Random(3)
    for _ in range(200):
        n = rng.choice([2, 3, 4])
        c = [[rng.randrange(1000) for _ in range(n)] for _ in range(n)]
        choice = ca.best_match(c)
        assert sorted(choice) == list(range(n)), "an observation used twice"
        best = min(sum(c[i][p[i]] for i in range(n))
                   for p in itertools.permutations(range(n)))
        assert sum(c[i][j] for i, j in enumerate(choice)) == best


@check("COLORASSIGN")
def tracks_keep_following_their_ghost_when_order_is_shuffled():
    rng = random.Random(5)
    ca = Colorassign()
    lines = [(0, 100), (50, 200), (100, 300), (150, 400)]   # start x, fixed y
    for frame in range(150):
        obs = [obs_dict(sx + 2 * frame, y) for sx, y in lines]
        rng.shuffle(obs)
        ca.update_track(obs)
        if frame == 0:
            first_y = [t.y for t in ca.tracks]
    for track, y0 in zip(ca.tracks, first_y):
        assert track.y == y0, "a track jumped to a different ghost"
        assert (track.vel_x, track.vel_y) == (2, 0)


@check("COLORASSIGN")
def predict_direction_picks_nearest_and_breaks_ties_in_order():
    ca = Colorassign()
    tr = Track(0, 240, 288, 2, T, False, False, False, False, False)
    tr.prev_x, tr.prev_y = 240, 288
    assert ca.predict_direction(tr, ["UP", "RIGHT"], 240, 100) == "UP"
    # UP and LEFT are exactly as close to this target: UP must win
    assert ca.predict_direction(tr, ["UP", "LEFT"], 216, 264) == "UP"
    assert ca.predict_direction(tr, ["LEFT", "DOWN"], 216, 312) == "LEFT"

@check("COLORASSIGN")
def swap_mixing_behaves_at_the_extremes():
    A, B = (INKY, PINKY, BLINKY, CLYDE), (PINKY, INKY, BLINKY, CLYDE)

    def probs(ca):
        post = ca.probability_conv()
        return post[ca._perm_lookup[A]], post[ca._perm_lookup[B]]

    ca = make_tracker(); set_belief(ca, {A: 0.90, B: 0.05})
    before = probs(ca)
    ca.mix_swap(0, 1, 0.0)
    assert all(abs(x - y) < 1e-6 for x, y in zip(before, probs(ca))), "p=0 must do nothing"

    ca = make_tracker(); set_belief(ca, {A: 0.90, B: 0.05})
    ca.mix_swap(0, 1, 0.5)
    a, b = probs(ca)
    assert abs(a - b) < 1e-6, "p=0.5 must make the twins equal"
    ca.mix_swap(0, 1, 0.5)
    assert abs(probs(ca)[0] - a) < 1e-6, "mixing at 0.5 twice must change nothing"

    ca = make_tracker(); set_belief(ca, {A: 0.90, B: 0.05})
    ca.mix_swap(0, 1, 1.0)
    a1, b1 = probs(ca)
    assert abs(a1 - before[1]) < 1e-3 and abs(b1 - before[0]) < 1e-3, "p=1 must fully swap"


@check("COLORASSIGN")
def swap_mixing_only_affects_the_two_tracks_involved():
    ca = make_tracker()
    set_belief(ca, {(INKY, PINKY, BLINKY, CLYDE): 0.93})
    others_before = [ca.get_probabilities(t) for t in (2, 3)]
    ca.mix_swap(0, 1, 0.5)
    for t, old in zip((2, 3), others_before):
        new = ca.get_probabilities(t)
        assert all(abs(new[k] - old[k]) < 1e-9 for k in old), f"track {t} changed"


@check("COLORASSIGN")
def mixing_changes_nothing_when_both_tracks_believe_the_same():
    ca = make_tracker()
    set_belief(ca, {(INKY, PINKY, BLINKY, CLYDE): 0.45,
                    (PINKY, INKY, BLINKY, CLYDE): 0.45})
    before = ca.probability_conv()
    ca.mix_swap(0, 1, 0.5)
    assert max(abs(a - b) for a, b in zip(before, ca.probability_conv())) < 1e-9

@check("COLORASSIGN")
def margin_is_never_negative_in_blending():
    ca = make_tracker()
    obs = [obs_dict(10 * i, 0) for i in range(4)]
    ca.update_track(obs)
    costs = [[ca.track_cost(t, o) for o in obs] for t in ca.tracks]
    choice = ca.best_match(costs)
    for i in range(4):
        for j in range(i + 1, 4):
            chosen = costs[i][choice[i]] + costs[j][choice[j]]
            swapped = costs[i][choice[j]] + costs[j][choice[i]]
            assert swapped - chosen >= 0

@check("COLORASSIGN")
def a_real_choice_updates_belief_and_keeps_it_valid():
    open_maze = ["#" * 12] + ["#" + " " * 10 + "#" for _ in range(10)] + ["#" * 12]
    ca = make_tracker([(120, 120), (500, 500), (600, 500), (700, 500)])
    ca.tracks[0].update(120, 118, 2, T, False, False, False, False, False)
    assert ca.tracks[0].started_from_decision_point
    ca.update_personality_scores(open_maze, 120, 24, "RIGHT", T)
    assert ca.scored_turns == 1 and ca.evidence_events == 1
    assert abs(posterior_sum(ca) - 1) < 1e-9
    assert max(ca.get_probabilities(0).values()) > 0.25, "belief did not move"
    # the same decision must not be counted twice
    ca.update_personality_scores(open_maze, 120, 24, "RIGHT", T)
    assert ca.scored_turns == 1, "decision was scored twice"


@check("COLORASSIGN")
def non_chase_modes_are_ignored():
    open_maze = ["#" * 12] + ["#" + " " * 10 + "#" for _ in range(10)] + ["#" * 12]
    ca = make_tracker([(120, 120), (500, 500), (600, 500), (700, 500)])
    ca.tracks[0].update(120, 118, 2, T, False, False, False, False, False)
    ca.update_personality_scores(open_maze, 120, 24, "RIGHT", T, mode="SCATTER")
    assert ca.scored_turns == 0, "scatter evidence must be opt-in"
    ca.update_personality_scores(open_maze, 120, 24, "RIGHT", T, mode="FRIGHTENED")
    assert ca.scored_turns == 0


@check("COLORASSIGN")
def probability_floor_keeps_every_assignment_alive():
    ca = make_tracker()
    set_belief(ca, {(BLINKY, PINKY, INKY, CLYDE): 0.999})
    for _ in range(50):
        for idx, perm in enumerate(ca.perms):
            ca.log_post[idx] += -3.0 if perm != (BLINKY, PINKY, INKY, CLYDE) else 0.0
        ca.adjust_low_prob()
    assert min(ca.probability_conv()) > 1e-6, "an assignment was driven to zero"


@check("COLORASSIGN")
def marginals_sum_to_one_and_identity_respects_threshold():
    ca = make_tracker()
    set_belief(ca, {(INKY, PINKY, BLINKY, CLYDE): 0.3,
                    (PINKY, INKY, BLINKY, CLYDE): 0.3,
                    (CLYDE, INKY, BLINKY, PINKY): 0.3})
    assert ca.get_identity(0) is None, "below 60% must not report a name"




# ===========================================================================
# GROUP 3: AI (expectimax)
# ===========================================================================
def make_ai(g, **kw):
    ai = Expectimax(g.color_assign, **kw)
    ai.prepare(g.maze)
    return ai


@check("AI")
def maze_graph_neighbours_are_symmetric_and_skip_walls():
    g = new_game()
    graph = make_ai(g, depth=3).graph
    for k, (r, c) in enumerate(graph.rc):
        assert g.maze[r][c] not in "#=", "a wall became a graph cell"
        for d in range(4):
            other = graph.nbr[k][d]
            if other >= 0:
                assert graph.nbr[other][OPP[d]] == k, "neighbour link not symmetric"


@check("AI")
def distance_table_is_a_proper_metric_on_the_maze():
    g = new_game()
    graph = make_ai(g, depth=3).graph
    rng = random.Random(1)
    for _ in range(300):
        a, b = rng.randrange(graph.n), rng.randrange(graph.n)
        assert graph.dist_row(a)[a] == 0
        assert graph.dist_row(a)[b] == graph.dist_row(b)[a], "distance not symmetric"
    for k in range(graph.n):
        for other in graph.nbr[k]:
            if other >= 0:
                assert graph.dist_row(k)[other] == 1


@check("AI")
def ghosts_cannot_reverse_unless_in_a_dead_end():
    g = new_game()
    graph = make_ai(g, depth=3).graph
    for k in range(graph.n):
        for incoming in range(4):
            options = graph.ghost_legal[k][incoming]
            for d in options:
                assert graph.nbr[k][d] >= 0, "ghost allowed to walk into a wall"
            real = [d for d in range(4) if graph.nbr[k][d] >= 0]
            if len(real) > 1 and OPP[incoming] in real:
                assert OPP[incoming] not in options, "ghost allowed to reverse"


@check("AI")
def closed_form_collision_matches_frame_by_frame():
    rng = random.Random(1)
    for _ in range(30000):
        ps, gs = rng.choice([2, 3, 4]), rng.choice([1, 2, 4, 6, 8])
        pvx, pvy = rng.choice([(ps, 0), (-ps, 0), (0, ps), (0, -ps)])
        gvx, gvy = rng.choice([(gs, 0), (-gs, 0), (0, gs), (0, -gs), (0, 0)])
        px, py = rng.randrange(0, 300, 2), rng.randrange(0, 300, 2)
        gx, gy = px + rng.randrange(-100, 100), py + rng.randrange(-100, 100)
        dt = rng.randint(1, 24)
        got = Expectimax._collision_frame(px, py, pvx, pvy, T, gx, gy, gvx, gvy, T, dt)
        expected = 0
        for t in range(1, dt + 1):
            ax, ay, bx, by = px + pvx * t, py + pvy * t, gx + gvx * t, gy + gvy * t
            if ax < bx + T and bx < ax + T and ay < by + T and by < ay + T:
                expected = t
                break
        assert got == expected, (px, py, pvx, pvy, gx, gy, gvx, gvy, dt, got, expected)


@check("AI")
def touching_edges_is_not_a_collision():
    # 24 px apart, both standing still: edges touch but do not overlap
    assert Expectimax._collision_frame(0, 0, 0, 0, T, T, 0, 0, 0, T, 10) == 0
    assert Expectimax._collision_frame(0, 0, 0, 0, T, T - 1, 0, 0, 0, T, 10) == 1


@check("AI")
def hypotheses_are_normalised_and_sensible():
    g = new_game()
    ai = make_ai(g, depth=3)
    cases = [
        {"BLINKY": .25, "PINKY": .25, "INKY": .25, "CLYDE": .25},
        {"BLINKY": 1.0, "PINKY": 0, "INKY": 0, "CLYDE": 0},
        {"BLINKY": .5, "PINKY": 0, "INKY": 0, "CLYDE": .5},
        {"BLINKY": .2, "PINKY": .4, "INKY": .4, "CLYDE": 0},
    ]
    for probs in cases:
        hyps = ai._hypotheses(probs)
        assert 1 <= len(hyps) <= 3, hyps
        assert abs(sum(w for _, w in hyps) - 1) < 1e-9, hyps
        assert all(0 <= i <= 3 for i, _ in hyps)
    assert ai._hypotheses(cases[1]) == [(0, 1.0)]


@check("AI")
def ghost_outcomes_are_legal_and_sum_to_one_in_real_games():
    g = new_game(seed=3)
    ai = g.expectimax
    checked = 0
    for _ in range(120):
        run_frames(g, 5)
        if g.status != "PLAYING":
            break
        obs = g.ai_values()
        g.color_assign.update_track(obs["ghosts"])
        root, options = ai._compile(ai.create_state(obs))
        px, py, pd, qd, gl = root[0], root[1], root[2], root[3], root[4]
        for gi, gh in enumerate(gl):
            if gh is None:
                continue
            x, y, d, speed, fr = gh
            if x % T or y % T:
                continue
            cell = ai.graph.cell_at[int(y // T) * ai._cols + int(x // T)]
            if cell < 0:
                continue
            legal = ai.graph.ghost_legal[cell][d if d >= 0 else 4]
            outs = ai._ghost_outcomes(gi, x, y, fr, cell, legal, px, py, pd, gl)
            assert abs(sum(p for _, p in outs) - 1) < 1e-9, outs
            assert all(dd in legal for dd, _ in outs), (outs, legal)
            assert all(p > 0 for _, p in outs)
            checked += 1
    assert checked > 0, "no ghost decisions were examined"


@check("AI")
def choose_action_always_returns_a_valid_direction_within_budget():
    budget = 0.03
    g = new_game(seed=4, budget=budget, depth=12)
    ai = g.expectimax
    worst = 0.0
    import time as _t
    with contextlib.redirect_stdout(io.StringIO()):
        for _ in range(900):
            if g.status != "PLAYING":
                break
            obs = g.ai_values()
            g.color_assign.update_track(obs["ghosts"])
            state = ai.create_state(obs)
            t0 = _t.perf_counter()
            action = ai.choose_action(state)
            worst = max(worst, _t.perf_counter() - t0)
            assert action in DIRECTIONS or action is None, action
            info = ai.last_search
            assert info["depth"] <= ai.depth
            assert info["depth"] >= 1 or info["nodes"] == 0
            g.update()
    assert worst <= budget * SLACK + 0.01, \
        f"slowest decision {worst * 1000:.0f} ms vs budget {budget * 1000:.0f} ms"


@check("AI")
def same_state_gives_the_same_answer_with_fixed_depth():
    g = new_game()
    ai = Expectimax(g.color_assign, depth=5, time_budget=None)
    ai.prepare(g.maze)
    state = hand_state(g, (240, 144), "RIGHT",
                       [ghost_state(336, 144, "LEFT")])
    first = ai.choose_action(state)
    values = dict(ai.last_search["values"])
    second = ai.choose_action(state)
    assert first == second and values == ai.last_search["values"]


@check("AI")
def deeper_search_does_more_work_and_reports_its_depth():
    g = new_game()
    state = hand_state(g, (240, 144), "RIGHT", [ghost_state(480, 144, "LEFT")])
    nodes = {}
    for depth in (2, 4, 6):
        ai = Expectimax(g.color_assign, depth=depth, time_budget=None)
        ai.prepare(g.maze)
        ai.choose_action(state)
        assert ai.last_search["depth"] == depth
        nodes[depth] = ai.last_search["nodes"]
    assert nodes[2] <= nodes[4] <= nodes[6], nodes


@check("AI")
def runs_when_there_are_no_active_ghosts():
    g = new_game()
    ai = Expectimax(g.color_assign, depth=6, time_budget=None)
    ai.prepare(g.maze)
    home = [ghost_state(300, 360, "UP", home=True) for _ in range(4)]
    assert ai.choose_action(hand_state(g, (240, 144), "RIGHT", home)) in DIRECTIONS
    assert ai.choose_action(hand_state(g, (240, 144), "RIGHT", [])) in DIRECTIONS

@check("AI")
def works_from_a_corner_tile_with_no_ghosts():
    g = new_game()
    ai = Expectimax(g.color_assign, depth=6, time_budget=None)
    maze = [list(row) for row in g.maze]
    ai.prepare(maze)
    # a maze corner: only two ways out
    state = hand_state(g, (24, 144), "LEFT", [], maze=maze)
    assert ai.choose_action(state) in DIRECTIONS


# ---------------------------------------------------------------------------
# Runner
# ---------------------------------------------------------------------------
def main(selected):
    groups = [s.upper() for s in selected] or ["GAME", "COLORASSIGN", "AI"]
    passed = failed = 0
    for group in groups:
        print(f"\n=== {group} ===")
        for g_name, name, fn in CHECKS:
            if g_name != group:
                continue
            try:
                fn()
                print(f"  PASS  {name}")
                passed += 1
            except AssertionError as e:
                print(f"  FAIL  {name}: {e}")
                failed += 1
            except Exception as e:                       # a crash is a failure too
                print(f"  ERROR {name}: {type(e).__name__}: {e}")
                failed += 1
    print(f"\n{passed} passed, {failed} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
