import pygame

from entities.entity import Entity

from settings import YELLOW, TILE_SIZE


class Pacman(Entity):

    def __init__(self, x, y):
        super().__init__(x, y, 40, 4, "LEFT")
        self.next_direction = None


    def draw(self, screen):

        pygame.draw.circle(
            screen,
            YELLOW,
            (
                self.x + self.size // 2,
                self.y + self.size // 2
            ),
            self.size // 2
        )

    def change_direction(self):
        if self.next_direction is not None:
            self.direction = self.next_direction
            self.next_direction = None

    def reset(self):
        self.x = self.spawn_x
        self.y = self.spawn_y

        self.direction = None
        self.next_direction = None