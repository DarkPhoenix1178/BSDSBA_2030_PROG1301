import random

from entities.ghost import Ghost

from settings import CYAN, HEIGHT,WIDTH, TILE_SIZE

class Inky(Ghost):

    def __init__(self, x, y):

        super().__init__(
            x,
            y,
            CYAN
        )
        self.scatter_target = (WIDTH - self.size, HEIGHT - self.size)

    def get_chase_target(self, game):

        target_x = game.pacman.x
        target_y = game.pacman.y

        distance_ahead = TILE_SIZE * 2

        if game.pacman.direction == "UP":
            target_y -= distance_ahead

        elif game.pacman.direction == "DOWN":
            target_y += distance_ahead

        elif game.pacman.direction == "LEFT":
            target_x -= distance_ahead

        elif game.pacman.direction == "RIGHT":
            target_x += distance_ahead

        blinky = game.ghosts[0]

        vector_x = (target_x - blinky.x)
        vector_y = (target_y - blinky.y)

        target_x = target_x + vector_x
        target_y = target_y + vector_y

        return target_x, target_y