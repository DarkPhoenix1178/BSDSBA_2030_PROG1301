import math
import sys
import time
from collections import deque

from settings import TILE_SIZE, FPS

DIRECTIONS = ("UP", "LEFT", "DOWN", "RIGHT")
DIR_INDEX = {name: index for index, name in enumerate(DIRECTIONS)}
DX = (0, -1, 0, 1)
DY = (-1, 0, 1, 0)
OPP = (2, 3, 0, 1)
UP, LEFT, DOWN, RIGHT = 0, 1, 2, 3

PERSONALITY_NAMES = ("BLINKY", "PINKY", "INKY", "CLYDE")
BLINKY, PINKY, INKY, CLYDE = 0, 1, 2, 3

EPS = 1e-6
UNREACHABLE = 10_000
_now = time.perf_counter

DEATH_VALUE = -1_000_000          # being caught
DEATH_FRAME_BONUS = 40            # dying later is better than dying sooner
PELLET_DISTANCE_WEIGHT = 6        # per tile to the nearest dot
DANGER_RANGE = 8.0
DANGER_WEIGHT = 300
CLOSE_CALL_PENALTY = 60_000
TERRITORY_RADIUS = 14
TERRITORY_WEIGHT = 10_000
TRAPPED_CELLS = 2
TRAPPED_PENALTY = 80_000
FRIGHTENED_BONUS = 60
REVERSE_PENALTY = 40
MAX_SIM_FRAMES = 900

class _Timeout(Exception):
    pass

class MazeGraph:
    def __init__(self, maze):
        T = TILE_SIZE
        self.rows = len(maze)
        self.cols = len(maze[0])

        self.cell_at = [-1] * (self.rows * self.cols)
        self.rc = []

        for r in range(self.rows):
            for c in range(self.cols):
                if maze[r][c] not in ("#", "="):
                    self.cell_at[r * self.cols + c] = len(self.rc)
                    self.rc.append((r, c))

        self.n = len(self.rc)
        self.bit = [1 << k for k in range(self.n)]

        # neighbour id per direction, or -1
        self.nbr = []
        for r, c in self.rc:
            row = []
            for d in range(4):
                r2, c2 = r + DY[d], c + DX[d]
                if 0 <= r2 < self.rows and 0 <= c2 < self.cols:
                    row.append(self.cell_at[r2 * self.cols + c2])
                else:
                    row.append(-1)
            self.nbr.append(row)

        # pixel position (top-left) of each cell, and of each neighbour
        self.xy = [(c * T, r * T) for r, c in self.rc]
        self.nbr_xy = [
            [self.xy[k] if k >= 0 else None for k in row] for row in self.nbr
        ]

        # Ghost options at a tile: ghost_legal[cell][incoming direction],
        # incoming 4 = "no direction yet".  Ghosts may not reverse unless
        # they are in a dead end.
        self.ghost_legal = []
        for k in range(self.n):
            per_incoming = []
            for incoming in range(5):
                reverse = OPP[incoming] if incoming < 4 else -1
                options = tuple(
                    d for d in range(4)
                    if self.nbr[k][d] >= 0 and d != reverse
                )
                if not options and reverse >= 0 and self.nbr[k][reverse] >= 0:
                    options = (reverse,)
                per_incoming.append(options)
            self.ghost_legal.append(per_incoming)

        self._rows = [None] * self.n
        self._balls = {}

    def dist_row(self, source):
        row = self._rows[source]
        if row is not None:
            return row

        row = [UNREACHABLE] * self.n
        row[source] = 0
        queue = deque([source])
        nbr = self.nbr
        while queue:
            k = queue.popleft()
            next_distance = row[k] + 1
            for other in nbr[k]:
                if other >= 0 and row[other] == UNREACHABLE:
                    row[other] = next_distance
                    queue.append(other)

        self._rows[source] = row
        return row

    def precompute_all(self):
        for k in range(self.n):
            self.dist_row(k)

    def ball(self, cell, radius):
        key = (cell, radius)
        cached = self._balls.get(key)
        if cached is None:
            row = self.dist_row(cell)
            cached = [(c, d) for c, d in enumerate(row) if d <= radius]
            self._balls[key] = cached
        return cached

    def cell_of_pixels(self, x, y):
        col = int(round(x / TILE_SIZE))
        row = int(round(y / TILE_SIZE))
        if 0 <= row < self.rows and 0 <= col < self.cols:
            return self.cell_at[row * self.cols + col]
        return -1


class Expectimax:
    def __init__(self, color_assign, depth=8, time_budget=0.045, max_nodes=None, debug=False):
        self.color_assign = color_assign
        self.depth = max(1, int(depth))
        self.time_budget = time_budget
        self.max_nodes = max_nodes
        self.debug = debug

        self.error_rate = 0.06
        self.min_branch_probability = 0.05
        self.min_path_probability = 0.004
        self.model_scatter = True
        self.scatter_weight = 0.5
        self.default_ghost_speed = 2
        self.frightened_speed = 1

        self.graph = None
        self._wall_key = None

        self.decision_number = 0
        self.last_search = {}

        if sys.getrecursionlimit() < 10_000:
            sys.setrecursionlimit(10_000)

    def prepare(self, maze):
        self._ensure_graph(maze)
        self.graph.precompute_all()

    def _ensure_graph(self, maze):
        key = "".join(
            tile if tile in ("#", "=") else " "
            for row in maze for tile in row
        ) + str(len(maze[0]))

        if key != self._wall_key:
            self._wall_key = key
            self.graph = MazeGraph(maze)

    def create_state(self, observation):
        ghosts = []
        for track in self.color_assign.tracks:
            best_name, best_probability = self.color_assign.get_best_guess(
                track.track_id)

            ghosts.append({
                "track_id": track.track_id,
                "x": track.x,
                "y": track.y,
                "direction": track.direction,
                "speed": track.speed,
                "size": track.size,
                "frightened": track.frightened,
                "eaten": track.eaten,
                "home": track.home,
                "leaving": track.leaving,
                "entering": track.entering,
                "identity": self.color_assign.get_identity(track.track_id),
                "best_guess": best_name,
                "confidence": best_probability,
                "probabilities":
                    self.color_assign.get_probabilities(track.track_id),
            })

        pacman = observation["pacman"]
        power = bool(observation["power"])

        return {
            "pacman": {
                "x": pacman["x"],
                "y": pacman["y"],
                "direction": pacman["direction"],
                "speed": pacman["speed"],
                "size": pacman["size"],
            },
            "ghosts": ghosts,
            # Treated as read-only by the search, so it is not copied.
            "maze": observation["maze"],
            "power": power,
            "power_frames": observation["power_timer"] if power else 0,
            "ghost_mode": observation.get("ghost_mode", "CHASE"),
            "house_exit": observation.get("house_exit"),
        }

    # ------------------------------------------------------------------
    # Compile the public state into the compact search state
    # ------------------------------------------------------------------
    @staticmethod
    def _aligned(value):
        remainder = value % TILE_SIZE
        return remainder < EPS or TILE_SIZE - remainder < EPS

    @staticmethod
    def _snap(value):
        nearest = round(value / TILE_SIZE) * TILE_SIZE
        return nearest if abs(value - nearest) < EPS else value

    @staticmethod
    def _pixel_is_free(maze, x, y, size):
        pad = 0.1
        for corner_x, corner_y in (
                (x + pad, y + pad), (x + size - pad, y + pad),
                (x + pad, y + size - pad), (x + size - pad, y + size - pad)):
            col = int(corner_x // TILE_SIZE)
            row = int(corner_y // TILE_SIZE)
            if (row < 0 or row >= len(maze)
                    or col < 0 or col >= len(maze[0])):
                return False
            if maze[row][col] in ("#", "="):
                return False
        return True

    def _distance_to_alignment(self, x, y, direction):
        """Pixels until the next tile corner in the direction of travel
        (0 if already on one)."""
        T = TILE_SIZE
        if direction & 1:                       # LEFT or RIGHT
            offset = x % T
            distance = (T - offset) if direction == RIGHT else offset
        else:
            offset = y % T
            distance = (T - offset) if direction == DOWN else offset
        return 0.0 if distance < EPS else distance

    def _compile(self, state):
        maze = state["maze"]
        self._ensure_graph(maze)
        graph = self.graph
        T = TILE_SIZE
        self._T = T
        self._cols = graph.cols

        pacman = state["pacman"]
        self._ps = max(pacman["speed"], 1)
        self._psize = pacman["size"]

        px = self._snap(pacman["x"])
        py = self._snap(pacman["y"])
        pd = DIR_INDEX.get(pacman["direction"], -1)

        # ---- pellets as a bit set -----------------------------------
        mask = 0
        power_mask = 0
        bit = graph.bit
        for k, (r, c) in enumerate(graph.rc):
            tile = maze[r][c]
            if tile == ".":
                mask |= bit[k]
            elif tile == "o":
                mask |= bit[k]
                power_mask |= bit[k]
        self._power_mask = power_mask
        self._power_frames = 7 * FPS

        # distance (tiles) from every cell to the nearest remaining dot
        field = [UNREACHABLE] * graph.n
        queue = deque()
        for k in range(graph.n):
            if mask & bit[k]:
                field[k] = 0
                queue.append(k)
        while queue:
            k = queue.popleft()
            for other in graph.nbr[k]:
                if other >= 0 and field[other] == UNREACHABLE:
                    field[other] = field[k] + 1
                    queue.append(other)
        self._pellet_field = field

        # ---- ghosts -----------------------------------------------------
        self._scatter = (
            self.model_scatter and state.get("ghost_mode") == "SCATTER")

        exit_position = state.get("house_exit")
        self._exit = (None if exit_position is None else
                      (self._snap(exit_position[0]),
                       self._snap(exit_position[1])))
        if exit_position is not None:
            exit_position = self._exit

        included = []
        for ghost in state["ghosts"]:
            if ghost["eaten"] or ghost["entering"] or ghost["home"]:
                continue

            x, y = ghost["x"], ghost["y"]
            d = DIR_INDEX.get(ghost["direction"], -1)

            if ghost["leaving"]:
                # The game walks a leaving ghost sideways to the exit column
                # and then straight up the shaft.  We "unfold" that L-shaped
                # path into a straight run below the exit, so it reaches the
                # exit on exactly the same frame and its final approach is
                # identical.  Ghosts far from the exit are ignored for now.
                if exit_position is None:
                    continue
                path = (abs(x - exit_position[0])
                        + abs(y - exit_position[1]))
                if path > 4 * TILE_SIZE:
                    continue
                x = exit_position[0]
                y = exit_position[1] + path
                d = UP if path > 0 else LEFT

            speed = ghost["speed"] if ghost["speed"] > 0 else \
                self.default_ghost_speed
            frightened = 1 if ghost["frightened"] else 0
            included.append((ghost, self._snap(x), self._snap(y), d, speed,
                             frightened))

        self._n = len(included)
        self._gsize = []
        self._normal_speed = []
        self._hyps = []
        ghost_tuples = []

        for ghost, x, y, d, speed, frightened in included:
            self._gsize.append(ghost["size"])
            self._normal_speed.append(
                self.default_ghost_speed if frightened else speed)
            self._hyps.append(self._hypotheses(ghost["probabilities"]))
            ghost_tuples.append((x, y, d, speed, frightened))

        # For Inky: the other ghost most likely to be Blinky.
        self._blinky_ref = []
        for i, (ghost_i, *_rest) in enumerate(included):
            best, best_probability = -1, 0.0
            for j, (ghost_j, *_rest2) in enumerate(included):
                if i == j:
                    continue
                probability = ghost_j["probabilities"]["BLINKY"]
                if probability > best_probability:
                    best, best_probability = j, probability
            self._blinky_ref.append(best)

        # ---- Pac-Man ------------------------------------------------------
        power_frames = state["power_frames"] if state["power"] else 0
        combo = 0
        reward = 0.0

        # The game eats the dot under Pac-Man's centre this very frame.
        half = pacman["size"] / 2
        centre_col = int((px + half) // T)
        centre_row = int((py + half) // T)
        if 0 <= centre_row < graph.rows and 0 <= centre_col < graph.cols:
            centre_cell = graph.cell_at[centre_row * graph.cols + centre_col]
            if centre_cell >= 0 and mask & bit[centre_cell]:
                mask ^= bit[centre_cell]
                if power_mask & bit[centre_cell]:
                    reward += 50
                    power_frames = self._power_frames
                    ghost_tuples = [
                        (x, y, d, s, 1) for (x, y, d, s, f) in ghost_tuples
                    ]
                else:
                    reward += 10

        # ---- Pac-Man's options at the root -------------------------------
        # Each option is (action, direction now, queued turn).
        options = []
        aligned = self._aligned(px) and self._aligned(py)

        if pd >= 0 and not aligned:
            distance = self._distance_to_alignment(px, py, pd)
            ahead_x = px + DX[pd] * distance
            ahead_y = py + DY[pd] * distance
            ahead_cell = graph.cell_of_pixels(ahead_x, ahead_y)

            # Turning around is possible immediately, mid-tile.
            options.append((OPP[pd], OPP[pd], -1))
            if ahead_cell >= 0:
                for d in range(4):
                    if d != OPP[pd] and graph.nbr[ahead_cell][d] >= 0:
                        options.append((d, pd, d))

        elif aligned:
            cell = graph.cell_of_pixels(px, py)
            if cell >= 0:
                for d in range(4):
                    if graph.nbr[cell][d] >= 0:
                        options.append((d, d, -1))

        else:
            # Never moved and sitting between tiles (the spawn point).
            for d in range(4):
                if self._pixel_is_free(
                        maze,
                        px + DX[d] * self._ps, py + DY[d] * self._ps,
                        pacman["size"]):
                    options.append((d, d, -1))

        root = (px, py, pd, -1, ghost_tuples, mask, power_frames, combo,
                reward, 0)
        return root, options

    def _hypotheses(self, probabilities):
        """Colours worth simulating for one ghost, with weights summing to 1."""
        ranked = sorted(
            ((probabilities.get(name, 0.0), index)
             for index, name in enumerate(PERSONALITY_NAMES)),
            reverse=True,
        )
        chosen = [(index, p) for p, index in ranked[:3] if p >= 0.08]
        if not chosen:
            chosen = [(ranked[0][1], ranked[0][0])]
        total = sum(p for _, p in chosen)
        return [(index, p / total) for index, p in chosen]

    # ------------------------------------------------------------------
    # Choosing an action
    # ------------------------------------------------------------------
    def choose_action(self, state):
        started = _now()
        self.decision_number += 1

        compiled = self._compile(state)
        root, options = compiled

        if not options:
            return None

        current = root[2]
        reverse = OPP[current] if current >= 0 else -1

        if len(options) == 1:
            self.last_search = {
                "depth": 0, "nodes": 0, "time_ms": 0.0,
                "action": DIRECTIONS[options[0][0]], "values": {},
            }
            return DIRECTIONS[options[0][0]]

        deadline = None if self.time_budget is None \
            else started + self.time_budget

        self._deadline = deadline
        self._nodes = 0
        self._abortable = False

        # Straight ahead first: it wins exact ties.
        options.sort(key=lambda option: option[0] != current)

        best_action = options[0][0]
        best_values = {}
        completed_depth = 0
        previous_iteration_time = 0.0

        for depth in range(1, self.depth + 1):
            iteration_started = _now()
            self._abortable = depth > 1

            try:
                values = {}
                for action, direction_now, queued in options:
                    start = (root[0], root[1], direction_now, queued,
                             root[4], root[5], root[6], root[7], root[8],
                             root[9])
                    value = self._advance(start, 0, depth - 1, 1.0)
                    if action == reverse:
                        value -= REVERSE_PENALTY
                    values[action] = value
            except _Timeout:
                break

            best_values = values
            completed_depth = depth
            best_action = max(
                options, key=lambda option: (values[option[0]],
                                             option[0] == current))[0]

            now = _now()
            iteration_time = now - iteration_started

            # Don't start an iteration that clearly cannot finish.
            if deadline is not None:
                growth = (iteration_time / previous_iteration_time
                          if previous_iteration_time > 1e-4 else 4.0)
                growth = min(max(growth, 2.0), 10.0)
                if iteration_time * growth > (deadline - now) * 3:
                    break
            previous_iteration_time = iteration_time

        elapsed = _now() - started
        self.last_search = {
            "depth": completed_depth,
            "nodes": self._nodes,
            "time_ms": elapsed * 1000.0,
            "action": DIRECTIONS[best_action],
            "values": {DIRECTIONS[a]: v for a, v in best_values.items()},
        }

        if self.debug:
            print(
                f"[EXPECTIMAX] #{self.decision_number} "
                f"depth {completed_depth}/{self.depth} "
                f"nodes {self._nodes} {elapsed * 1000:.1f} ms -> "
                f"{DIRECTIONS[best_action]}"
            )

        return DIRECTIONS[best_action]

    # ------------------------------------------------------------------
    # The simulation
    # ------------------------------------------------------------------
    def _advance(self, S, gi, depth, probability):
        """
        Run the world forward from state S until Pac-Man next needs to make
        a decision (or dies, or the horizon is reached).  Ghosts at
        intersections from index `gi` onward decide first.  Returns the
        expected value.
        """
        self._nodes += 1
        if self._abortable and not (self._nodes & 15):
            if (self.max_nodes is not None and self._nodes > self.max_nodes) \
                    or (self._deadline is not None
                        and _now() > self._deadline):
                raise _Timeout

        px, py, pd, qd, ghosts, mask, power, combo, reward, t = S
        T = self._T
        count = self._n
        gl = ghosts
        copied = False

        while gi < count:
            ghost = gl[gi]
            if ghost is not None:
                x, y, d, speed, frightened = ghost

                # Ghost climbing the house exit shaft: no intersections
                # there; at the top it turns LEFT, like the real game.
                exit_point = self._exit
                if (exit_point is not None and d == UP
                        and x == exit_point[0] and y >= exit_point[1]):
                    if y == exit_point[1]:
                        if not copied:
                            gl = gl[:]
                            copied = True
                        gl[gi] = (x, y, LEFT, speed, frightened)
                    gi += 1
                    continue

                if x % T < EPS and y % T < EPS:          # at an intersection
                    cell = self.graph.cell_at[
                        int(y // T) * self._cols + int(x // T)]

                    if cell < 0:
                        # Somewhere we cannot model (e.g. a door tile).
                        if not copied:
                            gl = gl[:]
                            copied = True
                        gl[gi] = None
                        gi += 1
                        continue

                    if frightened and speed != self.frightened_speed:
                        speed = self.frightened_speed

                    legal = self.graph.ghost_legal[cell][d if d >= 0 else 4]
                    outcomes = self._ghost_outcomes(
                        gi, x, y, frightened, cell, legal, px, py, pd, gl)

                    if len(outcomes) == 1:
                        if not copied:
                            gl = gl[:]
                            copied = True
                        gl[gi] = (x, y, outcomes[0][0], speed, frightened)
                    else:
                        total = 0.0
                        for direction, chance in outcomes:
                            branch = gl[:]
                            branch[gi] = (x, y, direction, speed, frightened)
                            branch_state = (px, py, pd, qd, branch, mask,
                                            power, combo, reward, t)
                            branch_probability = probability * chance

                            if branch_probability < self._min_path:
                                value = self._leaf(branch_state)
                            else:
                                value = self._advance(
                                    branch_state, gi + 1, depth,
                                    branch_probability)
                            total += chance * value
                        return total
            gi += 1

        return self._move(
            (px, py, pd, qd, gl, mask, power, combo, reward, t),
            depth, probability)

    @property
    def _min_path(self):
        return self.min_path_probability

    def _move(self, S, depth, probability):
        """Advance every entity to the next event and handle what happens."""
        px, py, pd, qd, gl, mask, power, combo, reward, t = S
        T = self._T
        ps = self._ps

        if pd < 0 or t > MAX_SIM_FRAMES:
            return self._leaf(S)

        # -- frames until Pac-Man reaches a tile corner --------------------
        if pd & 1:
            offset = px % T
            distance = (T - offset) if pd == RIGHT else offset
        else:
            offset = py % T
            distance = (T - offset) if pd == DOWN else offset
        if distance < EPS:
            distance = T
        pac_frames = math.ceil(distance / ps - 1e-9)
        dt = pac_frames

        # -- frames until each ghost reaches a tile corner ------------------
        ghost_frames = []
        for g in gl:
            if g is None or g[2] < 0:
                ghost_frames.append(0)
                continue
            x, y, d, speed, _ = g
            if d & 1:
                offset = x % T
                distance = (T - offset) if d == RIGHT else offset
            else:
                offset = y % T
                distance = (T - offset) if d == DOWN else offset
            if distance < EPS:
                distance = T
            frames = math.ceil(distance / speed - 1e-9) if speed > 0 else 0
            ghost_frames.append(frames)
            if 0 < frames < dt:
                dt = frames

        if power > 0 and power < dt:
            dt = power
        if dt < 1:
            dt = 1

        # -- collisions during these dt frames ------------------------------
        pvx = DX[pd] * ps
        pvy = DY[pd] * ps
        psize = self._psize
        death_frame = 0
        eaten = None

        for index, g in enumerate(gl):
            if g is None:
                continue
            x, y, d, speed, frightened = g

            # Cheap rejection: too far apart to touch within dt frames.
            reach = dt * (ps + speed) + psize + self._gsize[index]
            if abs(x - px) >= reach or abs(y - py) >= reach:
                continue

            if d >= 0:
                gvx = DX[d] * speed
                gvy = DY[d] * speed
            else:
                gvx = gvy = 0

            frame = self._collision_frame(
                px, py, pvx, pvy, psize,
                x, y, gvx, gvy, self._gsize[index], dt)

            if frame:
                if frightened:
                    if eaten is None:
                        eaten = []
                    eaten.append((frame, index))
                elif death_frame == 0 or frame < death_frame:
                    death_frame = frame

        if death_frame:
            return DEATH_VALUE + (t + death_frame) * DEATH_FRAME_BONUS

        # -- move everybody --------------------------------------------------
        new_gl = gl[:]
        if eaten:
            eaten.sort()
            for _, index in eaten:
                reward += min(200 * (2 ** combo), 1600)
                combo += 1
                new_gl[index] = None

        for index, g in enumerate(new_gl):
            if g is None:
                continue
            x, y, d, speed, frightened = g
            if d >= 0:
                x += DX[d] * speed * dt
                y += DY[d] * speed * dt
                if ghost_frames[index] == dt:           # reached a corner
                    if d & 1:
                        x = round(x / T) * T
                    else:
                        y = round(y / T) * T
                new_gl[index] = (x, y, d, speed, frightened)

        px += pvx * dt
        py += pvy * dt
        t += dt

        reached = pac_frames == dt
        if reached:
            if pd & 1:
                px = round(px / T) * T
            else:
                py = round(py / T) * T

        # -- power pellet running out -----------------------------------------
        if power > 0:
            power -= dt
            if power <= 0:
                power = 0
                combo = 0
                for index, g in enumerate(new_gl):
                    if g is None:
                        continue
                    x, y, d, speed, frightened = g
                    new_gl[index] = (
                        x, y, OPP[d] if d >= 0 else d,
                        self._normal_speed[index], 0)

        if not reached:
            return self._advance(
                (px, py, pd, qd, new_gl, mask, power, combo, reward, t),
                0, depth, probability)

        # -- Pac-Man is on a tile corner: eat what is there ---------------------
        graph = self.graph
        cell = graph.cell_at[int(py // T) * self._cols + int(px // T)]
        if cell < 0:
            return self._leaf(
                (px, py, pd, qd, new_gl, mask, power, combo, reward, t))

        b = graph.bit[cell]
        if mask & b:
            mask ^= b
            if self._power_mask & b:
                reward += 50
                power = self._power_frames
                for index, g in enumerate(new_gl):
                    if g is not None:
                        x, y, d, speed, frightened = g
                        new_gl[index] = (x, y, d, speed, 1)
            else:
                reward += 10

        if qd >= 0:
            # The decision made earlier now takes effect; no new decision.
            if graph.nbr[cell][qd] >= 0:
                pd = qd
            return self._advance(
                (px, py, pd, -1, new_gl, mask, power, combo, reward, t),
                0, depth, probability)

        return self._node(
            (px, py, pd, -1, new_gl, mask, power, combo, reward, t),
            depth, probability)

    def _node(self, S, depth, probability):
        """Pac-Man chooses (max node)."""
        if depth <= 0:
            return self._leaf(S)

        px, py, pd, qd, gl, mask, power, combo, reward, t = S
        cell = self.graph.cell_at[
            int(py // self._T) * self._cols + int(px // self._T)]
        if cell < 0:
            return self._leaf(S)

        nbr = self.graph.nbr[cell]
        reverse = OPP[pd]
        actions = [d for d in range(4) if nbr[d] >= 0 and d != reverse]
        if not actions:
            actions = [reverse] if nbr[reverse] >= 0 else []
        if not actions:
            return self._leaf(S)

        best = -math.inf
        for action in actions:
            value = self._advance(
                (px, py, action, -1, gl, mask, power, combo, reward, t),
                0, depth - 1, probability)
            if value > best:
                best = value
        return best

    @staticmethod
    def _collision_frame(px, py, pvx, pvy, psize, gx, gy, gvx, gvy, gsize,
                         frames):
        """
        First whole frame in 1..frames at which two moving squares overlap,
        or 0.  Both move in straight lines, so this is a closed-form
        interval test instead of stepping frame by frame.  Overlap is strict
        (touching edges does not count), like pygame's colliderect.
        """
        lo = 1
        hi = frames

        rel_v = gvx - pvx
        rel_0 = gx - px
        if rel_v == 0:
            if not (-psize < rel_0 < gsize):
                return 0
        else:
            a = (-psize - rel_0) / rel_v
            b = (gsize - rel_0) / rel_v
            if a > b:
                a, b = b, a
            lo = max(lo, math.floor(a + 1e-9) + 1)
            hi = min(hi, math.ceil(b - 1e-9) - 1)
            if lo > hi:
                return 0

        rel_v = gvy - pvy
        rel_0 = gy - py
        if rel_v == 0:
            if not (-psize < rel_0 < gsize):
                return 0
        else:
            a = (-psize - rel_0) / rel_v
            b = (gsize - rel_0) / rel_v
            if a > b:
                a, b = b, a
            lo = max(lo, math.floor(a + 1e-9) + 1)
            hi = min(hi, math.ceil(b - 1e-9) - 1)
            if lo > hi:
                return 0

        return lo

    # ------------------------------------------------------------------
    # Ghost behaviour model
    # ------------------------------------------------------------------
    def _best_direction(self, legal, cell_xy, target_x, target_y):
        """Closest-to-target direction; ties go UP, LEFT, DOWN, RIGHT
        (`legal` is always in that order)."""
        best = -1
        best_distance = math.inf
        for d in legal:
            cx, cy = cell_xy[d]
            distance = (cx - target_x) ** 2 + (cy - target_y) ** 2
            if distance < best_distance:
                best_distance = distance
                best = d
        return best

    def _corner(self, identity):
        T = TILE_SIZE
        graph = self.graph
        right = (graph.cols + 2) * T
        bottom = (graph.rows + 2) * T
        if identity == BLINKY:
            return right, -2 * T
        if identity == PINKY:
            return -2 * T, -2 * T
        if identity == INKY:
            return right, bottom
        return -2 * T, bottom

    def _ghost_outcomes(self, gi, x, y, frightened, cell, legal, px, py, pd,
                        gl):
        """((direction, probability), ...) for a ghost at an intersection."""
        options = len(legal)
        if options == 1:
            return ((legal[0], 1.0),)

        if frightened:
            share = 1.0 / options
            return tuple((d, share) for d in legal)

        T = self._T
        cell_xy = self.graph.nbr_xy[cell]

        # The ghost decides after Pac-Man has moved this frame.
        if pd >= 0:
            look_x, look_y = DX[pd], DY[pd]
            ahead_x = px + look_x * self._ps
            ahead_y = py + look_y * self._ps
        else:
            look_x = look_y = 0
            ahead_x, ahead_y = px, py

        error = self.error_rate
        miss = error / (options - 1)
        hit = 1.0 - error
        scatter = self._scatter
        scatter_share = self.scatter_weight if scatter else 0.0
        chase_share = 1.0 - scatter_share

        probabilities = [0.0, 0.0, 0.0, 0.0]

        for identity, weight in self._hyps[gi]:
            # ---- where would this personality aim while chasing? ----
            if identity == BLINKY:
                tx, ty = ahead_x, ahead_y
            elif identity == PINKY:
                tx = ahead_x + look_x * 4 * T
                ty = ahead_y + look_y * 4 * T
            elif identity == INKY:
                reference = self._blinky_ref[gi]
                blinky = gl[reference] if reference >= 0 else None
                if blinky is None:
                    tx, ty = ahead_x, ahead_y
                else:
                    # Blinky is updated before Inky within a frame, so Inky
                    # sees Blinky one step further along (unless Blinky is
                    # itself deciding this very frame and has not chosen).
                    bx, by, bd, bspeed = blinky[0], blinky[1], blinky[2], \
                        blinky[3]
                    if bd >= 0 and (reference < gi or bx % T >= EPS
                                    or by % T >= EPS):
                        bx += DX[bd] * bspeed
                        by += DY[bd] * bspeed
                    two_x = ahead_x + look_x * 2 * T
                    two_y = ahead_y + look_y * 2 * T
                    tx = 2 * two_x - bx
                    ty = 2 * two_y - by
            else:  # CLYDE
                dx = ahead_x - x
                dy = ahead_y - y
                if dx * dx + dy * dy >= (8 * T) ** 2:
                    tx, ty = ahead_x, ahead_y
                else:
                    tx, ty = self._corner(CLYDE)

            chosen = self._best_direction(legal, cell_xy, tx, ty)
            share = weight * chase_share
            for d in legal:
                probabilities[d] += share * (hit if d == chosen else miss)

            if scatter_share:
                cx, cy = self._corner(identity)
                chosen = self._best_direction(legal, cell_xy, cx, cy)
                share = weight * scatter_share
                for d in legal:
                    probabilities[d] += share * (hit if d == chosen else miss)

        # Drop very unlikely outcomes and renormalise.
        threshold = self.min_branch_probability
        outcomes = [(d, probabilities[d]) for d in legal
                    if probabilities[d] >= threshold]
        if not outcomes:
            best = max(legal, key=lambda d: probabilities[d])
            return ((best, 1.0),)

        total = 0.0
        for _, p in outcomes:
            total += p
        outcomes.sort(key=lambda item: -item[1])
        return tuple((d, p / total) for d, p in outcomes)

    # ------------------------------------------------------------------
    # Static evaluation
    # ------------------------------------------------------------------
    def _leaf(self, S):
        px, py, pd, qd, gl, mask, power, combo, reward, t = S
        graph = self.graph
        T = self._T
        ps = self._ps

        cell = graph.cell_of_pixels(px, py)
        if cell < 0:
            return reward - 5_000.0

        value = float(reward)

        if mask:
            nearest = self._pellet_field[cell]
            if nearest < UNREACHABLE:
                value -= PELLET_DISTANCE_WEIGHT * nearest

        threats = []     # (distance row, pixels already to travel, speed)
        closest_threat = math.inf

        for g in gl:
            if g is None:
                continue
            x, y, d, speed, frightened = g
            if speed <= 0:
                continue

            # Where does this ghost next stand on a tile corner?
            offset_px = 0.0
            if d >= 0 and (x % T >= EPS or y % T >= EPS):
                if d & 1:
                    off = x % T
                    remaining = (T - off) if d == RIGHT else off
                else:
                    off = y % T
                    remaining = (T - off) if d == DOWN else off
                if remaining < EPS:
                    remaining = 0.0
                offset_px = remaining
                gx = x + DX[d] * remaining
                gy = y + DY[d] * remaining
            else:
                gx, gy = x, y

            ghost_cell = graph.cell_of_pixels(gx, gy)
            if ghost_cell < 0:
                continue

            row = graph.dist_row(ghost_cell)
            tiles = row[cell]
            if tiles >= UNREACHABLE:
                continue

            if frightened:
                # An edible ghost: be drawn towards it while power lasts.
                if power > 0 and tiles * T / ps < power:
                    value += FRIGHTENED_BONUS * max(0, 10 - tiles)
                continue

            eta_tiles = (offset_px + tiles * T) * ps / (speed * T)
            threats.append((row, offset_px, speed))
            if eta_tiles < closest_threat:
                closest_threat = eta_tiles

            if eta_tiles < DANGER_RANGE:
                value -= DANGER_WEIGHT * (DANGER_RANGE - eta_tiles) ** 2
            if eta_tiles < 1.0:
                value -= CLOSE_CALL_PENALTY

        if threats:
            # Territory: cells near Pac-Man that he reaches before any ghost.
            ball = graph.ball(cell, TERRITORY_RADIUS)
            margin = 0.5 * T / ps
            safe = 0
            for other, distance in ball:
                pac_time = distance * T / ps + margin
                for row, offset_px, speed in threats:
                    if (offset_px + row[other] * T) / speed <= pac_time:
                        break
                else:
                    safe += 1

            value += TERRITORY_WEIGHT * safe / len(ball)
            if safe <= TRAPPED_CELLS:
                value -= TRAPPED_PENALTY

        return value
