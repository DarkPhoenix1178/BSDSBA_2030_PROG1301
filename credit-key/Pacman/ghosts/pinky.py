from entities.ghost import Ghost

from settings import PINK,TILE_SIZE

class Pinky(Ghost):

    def __init__(self,x,y):
        super().__init__(x,y,PINK)
        self.scatter_target = (0,0)

    def get_chase_target(self, game):
        target_x = game.pacman.x
        target_y = game.pacman.y
        distance_ahead = TILE_SIZE * 4

        if game.pacman.direction == "UP":
            target_y -= distance_ahead
        elif game.pacman.direction == "DOWN":
            target_y += distance_ahead
        elif game.pacman.direction == "LEFT":
            target_x -= distance_ahead
        elif game.pacman.direction == "RIGHT":
            target_x += distance_ahead
        return target_x, target_y