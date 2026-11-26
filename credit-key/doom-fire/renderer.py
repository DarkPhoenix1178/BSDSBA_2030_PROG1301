import pygame as pg

from settings import FIRE_WIDTH, FIRE_HEIGHT
from sliders import draw_sliders

def render(screen):
    draw_sliders(screen)

class Renderer:
    def __init__(self, screen):
        self.screen = screen
        self.font = pg.font.Font(None, 23)
        self.small_font = pg.font.Font(None, 19)
        self.title_font = pg.font.Font(None, 28)

    def draw(self, colors):
        self.screen.fill((18, 19, 24))

        surface = pg.surfarray.make_surface(
            colors.swapaxes(0, 1)
        )

        surface = pg.transform.scale(
            surface, (FIRE_WIDTH, FIRE_HEIGHT)
        )

        self.screen.blit(surface, (0, 0))
