import pygame,  random, itertools
from numpy.testing import assert_equal

from paimon.expectimax import Expectimax
from paimon.colorassign import Colorassign, PERSONALITY_COLORS
from ghosts import (Blinky, Inky, Pinky, Clyde)
from maps.maze import Maze
from settings import TILE_SIZE, BLUE, BLACK, WHITE, WIDTH, HEIGHT, FPS, RED, GRAY

from entities.pacman import Pacman

class Game:
    def __init__(self):
        pygame.init()

        pygame.display.set_caption("Pacman")
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))

        self.clock = pygame.time.Clock()

        self.font = pygame.font.Font(None, 36)

        self.original_maze = [list(row) for row in Maze]
        self.maze = [row.copy() for row in self.original_maze]
        self.house_center = (TILE_SIZE * 14.5, TILE_SIZE * 15)
        self.house_exit = (TILE_SIZE * 14.5, TILE_SIZE * 12)

        self.pacman = Pacman(TILE_SIZE * 14.5, TILE_SIZE * 24)
        self.last_ai_tile = None
        self.ghosts = [
            Blinky(self.house_exit[0], self.house_exit[1]),
            Inky(self.house_center[0] - TILE_SIZE, self.house_center[1]),
            Pinky(self.house_center[0], self.house_center[1]),
            Clyde(self.house_center[0] + TILE_SIZE, self.house_center[1]),
        ]

        self.ghosts[0].home = False
        self.ghosts[1].home = True
        self.ghosts[1].release_time = 5 * FPS
        self.ghosts[2].home = True
        self.ghosts[2].release_time = 2 * FPS
        self.ghosts[3].home = True
        self.ghosts[3].release_time = 8 * FPS

        self.lives = 1
        self.score = 0
        self.status = "PLAYING"
        self.power = False

        self.ghost_mode = "CHASE"

        self.mode_sched = 0
        self.ghost_sched = [
            ("SCATTER", 7 * 60),
            ("CHASE", 20 * 60),
            ("SCATTER", 7 * 60),
            ("CHASE", 20 * 60),
            ("SCATTER", 5 * 60),
            ("CHASE", 20 * 60),
            ("SCATTER", 5 * 60),
            ("CHASE", None)
        ]

        self.mode_timer = 0
        self.power_timer = 0
        self.combo_times = 0

        self.ai = True
        self.color_assign = Colorassign()
        self.expectimax = Expectimax(self.color_assign)
        self.expectimax.prepare(self.maze)

        self.debug = True
        self.debug_console = True
        self.debug_font = pygame.font.Font(None, 20)
        self._f3_down = False
        self._p_down = False
        self.frame_count = 0

    def handle_input(self):
        keys = pygame.key.get_pressed()

        f3_down = keys[pygame.K_F3]
        if f3_down and not self._f3_down:
            self.debug = not self.debug
        self._f3_down = f3_down

        if self.ai:
            return

        if keys[pygame.K_w]:
            self.pacman.next_direction = "UP"

        if keys[pygame.K_s]:
            self.pacman.next_direction = "DOWN"

        if keys[pygame.K_a]:
            self.pacman.next_direction = "LEFT"

        if keys[pygame.K_d]:
            self.pacman.next_direction = "RIGHT"

    def update(self):
        if self.status != "PLAYING":
            return

        self.frame_count += 1
        observation = self.ai_values()

        self.color_assign.update_track(observation["ghosts"])
        if observation["ghosts"] and (observation["ghost_mode"] == "CHASE"):
            self.color_assign.update_personality_scores(
                maze=observation["maze"],
                pacman_x=observation["pacman"]["x"],
                pacman_y=observation["pacman"]["y"],
                direction=observation["pacman"]["direction"],
                size=observation["ghosts"][0]["size"],
                mode=observation["ghost_mode"]
            )


        if self.ai:
            current_tile = (self.get_pacman_tile())
            next_x, next_y, size = self.pacman.next_move(self.pacman.direction)
            if current_tile != self.last_ai_tile or self.is_wall(next_x, next_y, size):

                state = self.expectimax.create_state(observation)
                action = self.expectimax.choose_action(state)

                if action is not None:
                    self.pacman.next_direction = action

                self.last_ai_tile = (current_tile)

        self.update_pacman()
        self.check_pellet()
        self.count_pellets()

        self.update_ghost_mode()

        self.check_eaten_ghosts()
        self.update_ghost()
        self.update_ghost_house()

        self.check_ghost_collision()
        self.update_power_mode()

    def draw(self):
        self.screen.fill(BLACK)
        self.draw_maze()

        for ghost in self.ghosts:
            ghost.draw(self.screen)

        self.pacman.draw(self.screen)

        self.draw_score()
        if self.debug:
            self.draw_debug()
        self.draw_end()

        pygame.display.update()

    def _pair_ghosts_with_tracks(self):
        """Match each real ghost to the tracker's track for it (by position).
        Only used for drawing; the AI never sees the real identities."""
        import itertools

        tracks = self.color_assign.tracks
        if len(tracks) != len(self.ghosts):
            return []

        best_cost = None
        best_order = None
        for order in itertools.permutations(range(len(tracks))):
            cost = 0
            for ghost, index in zip(self.ghosts, order):
                track = tracks[index]
                cost += (ghost.x - track.x) ** 2 + (ghost.y - track.y) ** 2
            if best_cost is None or cost < best_cost:
                best_cost, best_order = cost, order

        return [(ghost, tracks[index])
                for ghost, index in zip(self.ghosts, best_order)]

    def draw_debug(self):
        ca = self.color_assign
        pairs = self._pair_ghosts_with_tracks()
        grey = (170, 170, 170)

        # ---- label + ring on every ghost ----
        for ghost, track in pairs:
            name, probability = ca.get_best_guess(track.track_id)
            truth = type(ghost).__name__.upper()
            percent = int(round(probability * 100))

            colour = PERSONALITY_COLORS.get(name, grey) if name else grey
            centre = (int(ghost.x + ghost.size / 2),
                      int(ghost.y + ghost.size / 2))
            pygame.draw.circle(self.screen, colour, centre,
                               ghost.size // 2 + 4, 2)

            if name is None:
                label = "???"
            else:
                unsure = "?" if probability < ca.identity_threshold else ""
                verdict = "OK" if name == truth else f"WRONG:{truth}"
                label = f"{unsure}{name} {percent}% {verdict}"

            text = self.debug_font.render(label, True, colour)
            self.screen.blit(
                text,
                (centre[0] - text.get_width() // 2,
                 centre[1] - ghost.size // 2 - 18)
            )

        # ---- panel ----
        lines = [
            (f"TRACKER  evidence:{ca.scored_turns}  "
             f"best-assignment:{int(round(ca.assignment_probability() * 100))}%"
             f"  mode:{self.ghost_mode}", WHITE)
        ]
        for ghost, track in sorted(pairs, key=lambda p: p[1].track_id):
            name, probability = ca.get_best_guess(track.track_id)
            truth = type(ghost).__name__.upper()
            colour = PERSONALITY_COLORS.get(name, grey) if name else grey
            lines.append((f"{ca.describe_track(track.track_id)}  real:{truth}",
                          colour))

        info = self.expectimax.last_search
        if info:
            lines.append((
                f"AI depth {info['depth']}/{self.expectimax.depth}  "
                f"nodes {info['nodes']}  {info['time_ms']:.0f} ms  "
                f"-> {info['action']}", WHITE))
        lines.append(("F3 hides this panel", grey))

        line_height = self.debug_font.get_height() + 2
        panel = pygame.Surface((560, line_height * len(lines) + 8),
                               pygame.SRCALPHA)
        panel.fill((0, 0, 0, 170))
        self.screen.blit(panel, (6, 40))

        for index, (line, colour) in enumerate(lines):
            text = self.debug_font.render(line, True, colour)
            self.screen.blit(text, (12, 44 + index * line_height))

    def draw_maze(self):
        for row_index, row in enumerate(self.maze):
            for col_index, tile in enumerate(row):
                if tile == "#":
                    pygame.draw.rect(
                        self.screen,
                        BLUE,
                        (col_index * TILE_SIZE,
                            row_index * TILE_SIZE,
                            TILE_SIZE,
                            TILE_SIZE
                        )
                    )
                elif tile == "=":
                    pygame.draw.rect(
                        self.screen,
                        RED,
                        (col_index * TILE_SIZE,
                            row_index * TILE_SIZE,
                            TILE_SIZE,
                            TILE_SIZE
                        )
                    )
                elif tile == ".":
                    pygame.draw.circle(
                        self.screen,
                        WHITE,
                        (
                            (col_index + 1) * TILE_SIZE - TILE_SIZE // 2,
                            (row_index + 1) * TILE_SIZE - TILE_SIZE // 2,
                        ),
                        TILE_SIZE // 6
                    )
                elif tile == "o":
                    pygame.draw.circle(
                        self.screen,
                        WHITE,
                        (
                            (col_index + 1) * TILE_SIZE - TILE_SIZE // 2,
                            (row_index + 1) * TILE_SIZE - TILE_SIZE // 2,
                        ),
                        TILE_SIZE // 4
                    )

    def draw_score(self):
        text = self.font.render(f"Score: {self.score}    Lives: {self.lives}",True,WHITE)
        self.screen.blit(text, (10, 10))

    def update_ghost_house(self):
        for ghost in self.ghosts:
            if not ghost.home:
                continue

            ghost.house_timer += 1

            if ghost.house_timer < ghost.release_time:
                continue

            ghost.home = False
            ghost.leaving = True

    def update_leaving_ghost(self, ghost):
        exit_x, exit_y = self.house_exit

        if ghost.x < exit_x:
            ghost.x += ghost.speed

        elif ghost.x > exit_x:
            ghost.x -= ghost.speed

        elif ghost.y > exit_y:
            ghost.y -= ghost.speed

        elif ghost.y < exit_y:
            ghost.y += ghost.speed

        if (ghost.x == exit_x and ghost.y == exit_y):
            ghost.leaving = False
            ghost.eaten = False
            ghost.direction = "LEFT"
            ghost.house_timer = 0

    def is_wall(self, x, y, size, entity = None):
        pad = 0.00001
        corners = [(x + pad, y + pad),
        (x + size - pad, y + pad),
        (x + pad, y + size - pad),
        (x + size - pad, y + size - pad)]

        for corner_x, corner_y in corners:
            col = int(corner_x // TILE_SIZE)
            row = int(corner_y // TILE_SIZE)

            if self.maze[row][col] == "#":
                return True
            if self.maze[row][col] == "=":
                if entity is None:
                    return True
                can_cross_door = entity.eaten or entity.leaving or entity.entering
                if not can_cross_door:
                    return True
        return False

    def check_pellet(self):
        center_x = self.pacman.x + self.pacman.size // 2
        center_y = self.pacman.y + self.pacman.size // 2
        col = int(center_x // TILE_SIZE)
        row = int(center_y // TILE_SIZE)

        if self.maze[row][col] == ".":
            self.maze[row][col] = " "
            self.score += 10

        if self.maze[row][col] == "o":
            self.maze[row][col] = " "
            self.score += 50
            self.power = True
            self.power_timer = 7 * FPS
            for ghost in self.ghosts:
                if not ghost.eaten:
                    ghost.frightened = True
                if ghost.home:
                    ghost.frightened = False

    def update_ghost(self):
        for ghost in self.ghosts:
            if ghost.home:
                continue
            if ghost.leaving:
                self.update_leaving_ghost(ghost)
                continue
            if ghost.entering:
                continue

            if self.is_centered(ghost):
                ghost.direction = ghost.choose_direction(self, self.get_possible_directions(ghost))

            next_x, next_y, size = ghost.next_move(ghost.direction)
            if not self.is_wall(next_x, next_y, size, ghost):
                ghost.x = next_x
                ghost.y = next_y

    def get_possible_directions(self, ghost):
        possible_directions = []

        opposite = {
            "UP": "DOWN",
            "DOWN": "UP",
            "LEFT": "RIGHT",
            "RIGHT": "LEFT"
        }

        for direction in [
            "UP",
            "DOWN",
            "LEFT",
            "RIGHT"
        ]:

            test_x, test_y, size = ghost.next_move(direction)
            if direction == opposite[ghost.direction]:
                continue
            if not self.is_wall(test_x,test_y,size,ghost):
                possible_directions.append(direction)

        if not possible_directions:
            possible_directions.append(opposite[ghost.direction])

        return possible_directions

    def is_centered(self, entity):
        if (entity.x % (TILE_SIZE) == 0) and (entity.y % (TILE_SIZE) == 0):
            return True

    def update_power_mode(self):
        if self.power:
            self.power_timer -= 1

            if self.power_timer == 0:
                self.power = False
                self.combo_times = 0

                for ghost in self.ghosts:
                    if not ghost.eaten:
                        ghost.frightened = False
                        ghost.reverse_direction()
        else:
            for ghost in self.ghosts:
                if self.is_centered(ghost) and not ghost.eaten:
                    ghost.speed = 2

    def get_pacman_tile(self):
        center_x = (self.pacman.x + self.pacman.size / 2)
        center_y = (self.pacman.y + self.pacman.size / 2)

        return (int(center_x // TILE_SIZE), int(center_y // TILE_SIZE))

    def update_ghost_mode(self):
        for ghost in self.ghosts:
            if self.is_centered(ghost):
                if ghost.eaten:
                    ghost.speed = 8
                elif ghost.frightened:
                    ghost.speed = 1

        current_mode, duration = self.ghost_sched[self.mode_sched]
        self.ghost_mode = current_mode

        if duration is None:
            return
        self.mode_timer += 1
        if self.mode_timer < duration:
            return
        self.mode_timer = 0
        self.mode_sched += 1
        if (self.mode_sched >= len(self.ghost_sched)):
            self.mode_sched = (len(self.ghost_sched) - 1)

        self.ghost_mode = self.ghost_sched[self.mode_sched][0]

        for ghost in self.ghosts:
            if not ghost.eaten:
                ghost.mode = self.ghost_mode
                ghost.reverse_direction()

    def check_ghost_collision(self):
        for ghost in self.ghosts:
            if not self.pacman.rect.colliderect(ghost.rect):
                continue
            if ghost.frightened and not ghost.eaten:
                self.score += 200 * (2 ** self.combo_times)
                self.combo_times += 1
                ghost.eaten = True
                ghost.frightened = False
                return

            elif not ghost.eaten and not ghost.frightened:
                self.lives -= 1
                self.pacman.reset()

            if self.lives == 0:
                self.status = "GAMEOVER"
                return

    def update_pacman(self):
        old_x = self.pacman.x
        old_y = self.pacman.y
        old_direction = self.pacman.direction
        next_direction = self.pacman.next_direction
        if next_direction:
            next_x, next_y, size = self.pacman.next_move(next_direction)
            if not self.is_wall(next_x, next_y,size):
                self.pacman.change_direction()

        next_x, next_y, size = self.pacman.next_move(self.pacman.direction)

        if not self.is_wall(next_x, next_y, size):
            self.pacman.move()

    def draw_end(self):
        if self.status == "GAMEOVER":
            self.screen.fill(BLACK)
            winner_text = self.font.render(f"Game Over! Score: {self.score}",True, WHITE)
            winner_rect = winner_text.get_rect(center=(WIDTH // 2, HEIGHT // 2))
            self.screen.blit(winner_text, winner_rect)

    def count_pellets(self):
        count = 0
        for row in self.maze:
            count += row.count(".")
            count += row.count("o")

        if count == 0:
            self.maze = [row.copy() for row in self.original_maze]
        return count

    def reset_game(self):
        self.__init__()

    def check_eaten_ghosts(self):
        for ghost in self.ghosts:
            if not ghost.eaten:
                continue
            if (self.house_exit[0] - ghost.speed <= ghost.x or ghost.x <= self.house_exit[0] + ghost.speed)         and self.house_exit[1] == ghost.y:
                if self.is_centered(ghost):
                    ghost.entering = True
                    ghost.speed = 2
            if ghost.entering:
                home_x, home_y = self.house_center
                if ghost.x < home_x:
                    ghost.x += ghost.speed
                elif ghost.x > home_x:
                    ghost.x -= ghost.speed
                elif ghost.y > home_y:
                    ghost.y -= ghost.speed
                elif ghost.y < home_y:
                    ghost.y += ghost.speed
                if ghost.x == home_x and ghost.y == home_y:
                    ghost.home = True
                    ghost.eaten = False
                    ghost.entering = False
                    ghost.house_timer = 0
                    ghost.release_time = 1 * FPS
                    ghost.mode = self.ghost_mode
                    ghost.direction = "UP"

    def ai_values(self):
        ghosts_locations = []

        for ghost in self.ghosts:
            ghosts_locations.append({
                "x": ghost.x,
                "y": ghost.y,
                "size": ghost.size,
                "speed": ghost.speed,
                "frightened": ghost.frightened,
                "eaten": ghost.eaten,
                "home": ghost.home,
                "leaving": ghost.leaving,
                "entering": ghost.entering
            })
        random.shuffle(ghosts_locations)
        return {
            "pacman": {
                "x": self.pacman.x,
                "y": self.pacman.y,
                "direction": self.pacman.direction,
                "speed": self.pacman.speed,
                "size": self.pacman.size
            },
            "ghosts": ghosts_locations,

            "maze": [
                list(row)
                for row in self.maze
            ],

            "power": self.power,
            "power_timer": self.power_timer,
            "ghost_mode": self.ghost_mode,
            "house_exit": self.house_exit
            }
