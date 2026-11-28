import pygame,random

from entities.entity import Entity

from settings import RED, BLUE, WHITE


class Ghost(Entity):
    opposite = {
        "UP": "DOWN",
        "DOWN": "UP",
        "LEFT": "RIGHT",
        "RIGHT": "LEFT"
    }

    def __init__(self, x, y, color):

        super().__init__(x, y,40,2, "RIGHT")
        self.frightened = False
        self.eaten = False
        self.home = True
        self.leaving = False
        self.entering = False
        self.mode = "CHASE"
        self.scatter_target = (0,0)
        self.color = color
        self.release_time = 0
        self.house_timer = 0

    def draw(self, screen):
        if self.frightened:
            color = BLUE
        elif self.eaten:
            color = WHITE
        else:
            color = self.color

        pygame.draw.rect(screen, color,(self.x, self.y, self.size, self.size))

    def reset(self):
        self.x = self.spawn_x
        self.y = self.spawn_y
        self.speed = 2
        self.eaten = False
        self.frightened = False
        self.direction = "LEFT"

    def choose_best_direction(self, possible_directions, target_x, target_y):

        best_direction = None

        best_distance = float("inf")

        for direction in possible_directions:

            test_x, test_y, size = (
                self.next_move(
                    direction
                )
            )

            distance = (target_x - test_x) ** 2 + (target_y - test_y) ** 2

            if distance < best_distance:
                best_distance = distance
                best_direction = direction

        return best_direction

    def get_chase_target(self, game):
        return (
            game.pacman.x,
            game.pacman.y
        )

    def choose_direction(
            self,
            game,
            possible_directions
    ):
        if self.frightened:
            return self.choose_frightened_direction(
                possible_directions
            )

        if self.mode == "SCATTER":
            target_x, target_y = (
                self.scatter_target
            )

        else:
            target_x, target_y = (
                self.get_chase_target(game)
            )

        if self.eaten:
            target_x, target_y = (game.house_exit[0], game.house_exit[1])

        return self.choose_best_direction(
            possible_directions,
            target_x,
            target_y
        )

    def reverse_direction(self):

        if self.direction in self.opposite:
            self.direction = self.opposite[self.direction]

    def choose_frightened_direction(
            self,
            possible_directions
    ):

        return random.choice(
            possible_directions
        )