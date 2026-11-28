from entities.ghost import Ghost

from settings import RED, WIDTH, HEIGHT
from entities.pacman import Pacman

class Blinky(Ghost):

    def __init__(
        self,
        x,
        y
    ):

        super().__init__(
            x,
            y,
            RED
        )
        self.scatter_target = (WIDTH - self.size,0)

        self.elroy_stage_1 = 4
        self.elroy_stage_2 = 5

    def get_chase_target(self, game):
        return (game.pacman.x, game.pacman.y)
