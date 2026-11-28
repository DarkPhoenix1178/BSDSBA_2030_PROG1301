from entities.ghost import Ghost

from settings import ORANGE, HEIGHT, WIDTH, TILE_SIZE


class Clyde(Ghost):

    def __init__(self, x, y):

        super().__init__(
            x,
            y,
            ORANGE
        )
        self.scatter_target = (0, HEIGHT - self.size)


    def get_chase_target(self, game):
        distance = (game.pacman.x - self.x) ** 2 + (game.pacman.y - self.y) ** 2
        retreat_distance = TILE_SIZE * 8

        if (distance > retreat_distance ** 2):
            return (
                game.pacman.x,
                game.pacman.y
            )

        return self.scatter_target