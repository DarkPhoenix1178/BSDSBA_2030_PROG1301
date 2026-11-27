import itertools, math
from settings import TILE_SIZE
DIRECTION_PRIORITY = ["UP", "LEFT", "DOWN", "RIGHT"]

DIRECTION_CHANGE = {
    "UP": (0, -TILE_SIZE),
    "LEFT": (-TILE_SIZE, 0),
    "DOWN": (0, TILE_SIZE),
    "RIGHT": (TILE_SIZE, 0),
}

OPPOSITE_DIRECTION = {
    "UP": "DOWN",
    "DOWN": "UP",
    "LEFT": "RIGHT",
    "RIGHT": "LEFT",
}

PERSONALITIES = ["BLINKY", "PINKY", "INKY", "CLYDE"]
BLINKY, PINKY, INKY, CLYDE = 0, 1, 2, 3

PERSONALITY_COLORS = {
    "BLINKY": (255, 40, 40),
    "PINKY": (255, 150, 255),
    "INKY": (40, 235, 255),
    "CLYDE": (255, 175, 60),
}

class Track:
    def __init__(self, track_id, x, y, speed, size, frightened, eaten, home, leaving, entering):
        self.track_id = track_id

        self.x = x
        self.y = y
        self.prev_x = x
        self.prev_y = y

        self.vel_x = 0
        self.vel_y = 0

        self.speed = speed
        self.size = size

        self.direction = None
        self.prev_direction = None

        self.frightened = frightened
        self.eaten = eaten
        self.home = home
        self.leaving = leaving
        self.entering = entering

        self.missed_frames = 0

        self.decision_number = 0
        self.last_scored_decision = -1
        self.started_from_decision_point = False

        self.offset_x = x % TILE_SIZE
        self.offset_y = y % TILE_SIZE

    def update(self, x, y, speed, size, frightened, eaten, home, leaving, entering):
        self.prev_x = self.x
        self.prev_y = self.y
        self.prev_direction = self.direction

        self.x = x
        self.y = y
        self.size = size
        self.speed = speed

        self.vel_x = self.x - self.prev_x
        self.vel_y = self.y - self.prev_y

        self.frightened = frightened
        self.eaten = eaten
        self.home = home
        self.leaving = leaving
        self.entering = entering

        if self.vel_x > 0:
            self.direction = "RIGHT"
        elif self.vel_x < 0:
            self.direction = "LEFT"
        elif self.vel_y > 0:
            self.direction = "DOWN"
        elif self.vel_y < 0:
            self.direction = "UP"

        self.missed_frames = 0
        self.started_from_decision_point = (self.vel_x != 0 or self.vel_y != 0) and ((self.prev_x % (TILE_SIZE) == 0) or (self.prev_y % (TILE_SIZE) == 0))

        if self.started_from_decision_point:
            self.decision_number += 1

    def mark_missed(self):
        self.missed_frames += 1
        self.started_from_decision_point = False

    @property
    def valid_personality_evidence(self):
        return (
            not self.frightened
            and not self.eaten
            and not self.home
            and not self.leaving
            and not self.entering
        )

    def next_position(self):
        return self.x + self.vel_x, self.y + self.vel_y

    @property
    def change(self):
        if self.prev_direction is None or self.direction is None:
            return False
        return self.prev_direction != self.direction

class Colorassign:
    def __init__(
            self,
            error_rate=0.08,
            minimum_confidence=0.60,
            lock_threshold=0.90,
    ):
        self.tracks = []
        self.next_track_id = 0

        self.personalities = list(PERSONALITIES)
        self.error_rate = error_rate
        self.identity_threshold = minimum_confidence
        self.lock_threshold = lock_threshold

        self.perms = list(itertools.permutations(range(4)))
        self._perm_lookup = {perm: i for i, perm in enumerate(self.perms)}
        self._blinky_slot = [perm.index(BLINKY) for perm in self.perms]
        self.logs = [0.0] * len(self.perms)
        self.adjust_low_prob()

        self.scored_turns = 0
        self.evidence_events = 0
        self.minimum_scored_turns = 1

        self.prev_version = -1
        self.version = 0
        self.margin = None
        self.mapping = 0
        self.map_best = 0.0

        self.assignments = {}
        self.assignment_confidence = {}
        self.assignment_streak = 0
        self.required_assignment_streak = 1
        self.previous_assignment = {}
        self.assignment_locked = False
        self.global_confidence = 0.0
        self.best_assignment_score = 0.0
        self.second_assignment_score = 0.0

        self._last_reported = {}

        self.best_assignment()

    def create_track(self, observation):
        track = Track(
            track_id=self.next_track_id,
            x=observation["x"],
            y=observation["y"],
            size=observation["size"],
            speed=observation["speed"],
            frightened=observation["frightened"],
            eaten=observation["eaten"],
            home=observation["home"],
            leaving=observation["leaving"],
            entering=observation["entering"],
        )
        self.next_track_id += 1
        self.tracks.append(track)
        return track

    @staticmethod
    def distance_squared(x1, y1, x2, y2):
        return (x1 - x2) ** 2 + (y1 - y2) ** 2

    def track_cost(self, track, observation):
        cost = self.distance_squared(*track.next_position(), observation["x"], observation["y"])

        if track.eaten != observation["eaten"]:
            cost += 2_500
        if track.frightened != observation["frightened"]:
            cost += 50
        if track.home != observation["home"]:
            cost += 50
        return cost

    def matching(self, observations):
        possible = []
        for track in self.tracks:
            for index, observation in enumerate(observations):
                distance = self.distance_squared(*track.next_position(), observation["x"], observation["y"])
                possible.append((self.track_cost(track, observation), distance, track, index))
        possible.sort(key=lambda match: match[0])
        return possible

    def best_match(self, costs):
        size = len(costs)
        best_total = float("inf")
        best_choice = None
        for choice in itertools.permutations(range(size)):
            total = 0.0
            for i, j in enumerate(choice):
                total += costs[i][j]
                if total >= best_total:
                    break
            else:
                best_total = total
                best_choice = choice
        return list(best_choice)

    def update_track(self, observations):
        if not self.tracks:
            for observation in observations:
                self.create_track(observation)
            return self.tracks

        track_count = len(self.tracks)
        observation_count = len(observations)

        if track_count == observation_count:
            costs = [
                [self.track_cost(track, observation)
                 for observation in observations]
                for track in self.tracks
            ]
            choice = self.best_match(costs)

            for track, index in zip(self.tracks, choice):
                observation = observations[index]
                track.update(
                    x=observation["x"], y=observation["y"],
                    speed=observation["speed"], size=observation["size"],
                    eaten=observation["eaten"],
                    frightened=observation["frightened"],
                    home=observation["home"], leaving=observation["leaving"],
                    entering=observation["entering"],
                )

            self.possible_swap(costs, choice)
            return self.tracks

        possible_matches = self.matching(observations)
        matched_tracks = set()
        matched_observations = set()

        for (_, distance, track, index) in possible_matches:
            if track.track_id in matched_tracks or index in matched_observations:
                continue
            observation = observations[index]
            track.update(
                x=observation["x"], y=observation["y"],
                speed=observation["speed"], size=observation["size"],
                eaten=observation["eaten"],
                frightened=observation["frightened"],
                home=observation["home"], leaving=observation["leaving"],
                entering=observation["entering"],
            )
            matched_tracks.add(track.track_id)
            matched_observations.add(index)

        for track in self.tracks:
            if track.track_id not in matched_tracks:
                track.mark_missed()

        for index, observation in enumerate(observations):
            if index in matched_observations:
                continue
            if len(self.tracks) < 4:
                self.create_track(observation)

        return self.tracks

    def possible_swap(self, costs, choice):
        if len(self.tracks) != 4:
            return

        sigma_squared_2 = 2 * 3.0 ** 2

        for i in range(len(self.tracks)):
            for j in range(i + 1, len(self.tracks)):
                a, b = self.tracks[i], self.tracks[j]

                if a.home or b.home:
                    continue
                if a.vel_x == a.vel_y == 0 and b.vel_x == b.vel_y == 0:
                    continue

                chosen = costs[i][choice[i]] + costs[j][choice[j]]
                swapped = costs[i][choice[j]] + costs[j][choice[i]]
                margin = swapped - chosen

                swap_probability = 0.5 * math.exp(-margin / sigma_squared_2)
                if swap_probability > 0.01:
                    self.mix_swap(i, j, swap_probability)

    def mix_swap(self, i, j, swap_probability):
        posterior = self.probability_conv()
        mixed = list(posterior)

        for index, perm in enumerate(self.perms):
            swapped = list(perm)
            swapped[i], swapped[j] = swapped[j], swapped[i]
            swapped_index = self._perm_lookup[tuple(swapped)]
            mixed[index] = (
                    (1.0 - swap_probability) * posterior[index]
                    + swap_probability * posterior[swapped_index]
            )

        self.logs = [math.log(max(value, 1e-300)) for value in mixed]
        self.adjust_low_prob()
        self.version += 1

    @staticmethod
    def is_not_wall(maze, x, y, size):
        pad = 0.1
        corners = [
            (x + pad, y + pad),
            (x + size - pad, y + pad),
            (x + pad, y + size - pad),
            (x + size - pad, y + size - pad),
        ]
        for corner_x, corner_y in corners:
            column = int(corner_x // TILE_SIZE)
            row = int(corner_y // TILE_SIZE)

            if (row < 0 or row >= len(maze)
                    or column < 0 or column >= len(maze[0])):
                return False

            if maze[row][column] in ("#", "="):
                return False
        return True

    def legal_moves(self, maze, track, size):
        legal_moves = []
        reverse_direction = OPPOSITE_DIRECTION.get(track.prev_direction)

        for direction in DIRECTION_PRIORITY:
            if direction == reverse_direction:
                continue
            change_x, change_y = DIRECTION_CHANGE[direction]
            if self.is_not_wall(maze, track.prev_x + change_x,
                                track.prev_y + change_y, size):
                legal_moves.append(direction)

        if not legal_moves and reverse_direction is not None:
            change_x, change_y = DIRECTION_CHANGE[reverse_direction]
            if self.is_not_wall(maze, track.prev_x + change_x,
                                track.prev_y + change_y, size):
                legal_moves.append(reverse_direction)

        return legal_moves

    def predict_direction(self, track, legal_directions, target_x, target_y):
        best_direction = None
        best_distance = float("inf")

        for direction in DIRECTION_PRIORITY:
            if direction not in legal_directions:
                continue
            change_x, change_y = DIRECTION_CHANGE[direction]
            distance = self.distance_squared(
                track.prev_x + change_x, track.prev_y + change_y,
                target_x, target_y,
            )
            if distance < best_distance:
                best_distance = distance
                best_direction = direction
        return best_direction

    @staticmethod
    def get_pinky_target(pacman_x, pacman_y, pacman_direction):
        look_ahead = TILE_SIZE * 4
        target_x, target_y = pacman_x, pacman_y
        if pacman_direction == "UP":
            target_y -= look_ahead
        elif pacman_direction == "DOWN":
            target_y += look_ahead
        elif pacman_direction == "LEFT":
            target_x -= look_ahead
        elif pacman_direction == "RIGHT":
            target_x += look_ahead
        return target_x, target_y

    @staticmethod
    def get_clyde_target(track, pacman_x, pacman_y, maze):
        x_difference = pacman_x - track.prev_x
        y_difference = pacman_y - track.prev_y
        distance_squared = x_difference ** 2 + y_difference ** 2

        if distance_squared >= (TILE_SIZE * 8) ** 2:
            return pacman_x, pacman_y

        return -2 * TILE_SIZE, (len(maze) + 2) * TILE_SIZE

    @staticmethod
    def get_inky_target(pacman_x, pacman_y, direction, blinky):
        look_ahead = TILE_SIZE * 2
        ahead_x, ahead_y = pacman_x, pacman_y
        if direction == "UP":
            ahead_y -= look_ahead
        elif direction == "DOWN":
            ahead_y += look_ahead
        elif direction == "LEFT":
            ahead_x -= look_ahead
        elif direction == "RIGHT":
            ahead_x += look_ahead

        vector_x = ahead_x - blinky.x
        vector_y = ahead_y - blinky.y
        return ahead_x + vector_x, ahead_y + vector_y

    def update_personality_scores(self, maze, pacman_x, pacman_y, direction,
                                  size, mode="CHASE"):
        if len(self.tracks) != 4:
            return
        if mode != "CHASE":
            return

        evidence = []

        for slot, track in enumerate(self.tracks):
            if not track.started_from_decision_point:
                continue
            if track.decision_number == track.last_scored_decision:
                continue
            track.last_scored_decision = track.decision_number

            if not track.valid_personality_evidence:
                continue

            legal = self.legal_moves(maze, track, size)

            if len(legal) < 2 or track.direction not in legal:
                continue

            evidence.append(self.likelihood(slot, track, legal, maze, pacman_x, pacman_y, direction,mode))

        if not evidence:
            return

        new_log = []
        for index, perm in enumerate(self.perms):
            blinky_slot = self._blinky_slot[index]
            delta = 0.0
            for slot, per_colour, inky_table in evidence:
                personality = perm[slot]
                if personality == INKY:
                    delta += inky_table[blinky_slot]
                else:
                    delta += per_colour[personality]
            new_log.append(self.logs[index] * 0.995 + delta)

        self.logs = new_log
        self.adjust_low_prob()
        self.version += 1

        self.scored_turns += len(evidence)
        self.evidence_events += 1
        self._sync_compat()

    def likelihood(self, slot, track, legal, maze, pacman_x,
                   pacman_y, pacman_direction, mode="CHASE"):
        hit = math.log(1.0 - self.error_rate)
        miss = math.log(self.error_rate / (len(legal) - 1))

        def score(predicted):
            return hit if track.direction == predicted else miss

        per_colour = [0.0] * 4

        per_colour[BLINKY] = score(self.predict_direction(track, legal, pacman_x, pacman_y))
        per_colour[PINKY] = score(self.predict_direction(track, legal, *self.get_pinky_target(pacman_x, pacman_y, pacman_direction)))
        per_colour[CLYDE] = score(self.predict_direction(track, legal, *self.get_clyde_target(track, pacman_x, pacman_y, maze)))
        inky_table = [0.0] * 4
        for blinky_slot, candidate in enumerate(self.tracks):
            if candidate is track:
                continue
            inky_table[blinky_slot] = score(self.predict_direction(track, legal, *self.get_inky_target(pacman_x, pacman_y, pacman_direction, candidate)))

        return slot, per_colour, inky_table

    def adjust_low_prob(self):
        peak = max(self.logs)
        total = math.log(sum(math.exp(log - peak) for log in self.logs))
        shift = peak + total
        floor = -9.0
        self.logs = [max(log - shift, floor) for log in self.logs]
        peak = max(self.logs)
        total = math.log(sum(math.exp(log - peak) for log in self.logs))
        self.logs = [log - peak - total for log in self.logs]

    def probability_conv(self):
        return [math.exp(log) for log in self.logs]

    def best_assignment(self):
        if self.prev_version == self.version:
            return

        posterior = self.probability_conv()

        marginals = [[0.0] * 4 for _ in range(4)]
        for probability, perm in zip(posterior, self.perms):
            for slot in range(4):
                marginals[slot][perm[slot]] += probability

        best = max(range(len(posterior)), key=posterior.__getitem__)

        self.margin = marginals
        self.mapping = best
        self.map_best = posterior[best]
        self.prev_version = self.version

    def _sync_compat(self):
        self.best_assignment()
        perm = self.perms[self.mapping]

        self.assignments = {}
        for slot, track in enumerate(self.tracks):
            self.assignments[track.track_id] = PERSONALITIES[perm[slot]]

        posterior = sorted(self.probability_conv(), reverse=True)
        self.best_assignment_score = posterior[0]
        self.second_assignment_score = posterior[1]
        self.global_confidence = self.map_best
        self.assignment_locked = (
                self.map_best >= self.lock_threshold
        )
        self.calculate_confidence()

    def _slot_of(self, track_id):
        for slot, track in enumerate(self.tracks):
            if track.track_id == track_id:
                return slot
        return None

    def get_probabilities(self, track_id):
        slot = self._slot_of(track_id)
        if slot is None or len(self.tracks) != 4:
            return {name: 0.25 for name in PERSONALITIES}
        self.best_assignment()
        return {
            name: self.margin[slot][index]
            for index, name in enumerate(PERSONALITIES)
        }

    def get_best_guess(self, track_id):
        slot = self._slot_of(track_id)
        if slot is None or len(self.tracks) != 4 or self.evidence_events == 0:
            return None, 0.0
        self.best_assignment()
        personality = self.perms[self.mapping][slot]
        return (PERSONALITIES[personality],
                self.margin[slot][personality])

    def get_identity(self, track_id):
        name, probability = self.get_best_guess(track_id)
        if name is None or probability < self.identity_threshold:
            return None
        return name

    def get_confidence(self, track_id):
        return self.get_best_guess(track_id)[1]

    def assignment_probability(self):
        self.best_assignment()
        return self.map_best if self.evidence_events else 0.0

    def calculate_confidence(self):
        self.assignment_confidence = {}
        for track in self.tracks:
            self.assignment_confidence[track.track_id] = (
                self.get_confidence(track.track_id))
        return self.assignment_confidence

    def assign_personalities(self):
        self._sync_compat()
        return self.assignments

    def describe_track(self, track_id):
        probabilities = self.get_probabilities(track_id)
        name, probability = self.get_best_guess(track_id)

        bars = " ".join(
            f"{personality[0]}{int(round(probabilities[personality] * 100)):3d}"
            for personality in PERSONALITIES
        )

        if name is None:
            return f"track {track_id}: ???            [{bars}]"

        sure = "" if probability >= self.identity_threshold else "?"
        return (f"track {track_id}: {sure}{name:<6} "
                f"{int(round(probability * 100)):3d}%  [{bars}]")

    def consume_changes(self):
        messages = []
        for track in self.tracks:
            name, probability = self.get_best_guess(track.track_id)
            sure = name is not None and probability >= self.identity_threshold
            current = (name if sure else None)

            previous = self._last_reported.get(track.track_id, "UNSET")
            if previous == "UNSET" and name is None:
                self._last_reported[track.track_id] = None   # nothing to say yet
                continue
            if current != previous:
                shown = (f"{current} ({int(round(probability * 100))}%)"
                         if current else
                         (f"unsure, leaning {name} "
                          f"({int(round(probability * 100))}%)"
                          if name else "unknown"))
                before = "nothing" if previous in ("UNSET", None) else previous
                messages.append(
                    f"[TRACKER] track {track.track_id}: {before} -> {shown}")
                self._last_reported[track.track_id] = current
        return messages