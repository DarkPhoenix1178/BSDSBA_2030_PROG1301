import pygame as pg

from settings import FIRE_WIDTH, FIRE_HEIGHT
from sliders import draw_sliders


class Renderer:
    # 🆕 NEW: Centralized background color
    BACKGROUND_COLOR = (18, 19, 24)

    def __init__(self, screen):
        self.screen = screen
        self.font = pg.font.Font(None, 23)
        self.small_font = pg.font.Font(None, 19)
        self.title_font = pg.font.Font(None, 28)

    def draw(self, colors):
        # 🔄 CHANGED: Use centralized background color
        self.screen.fill(self.BACKGROUND_COLOR)

        surface = pg.surfarray.make_surface(
            colors.swapaxes(0, 1)
        )

        surface = pg.transform.scale(
            surface, (FIRE_WIDTH, FIRE_HEIGHT)
        )

        self.screen.blit(surface, (0, 0))

        # 🆕 NEW: Draw sliders
        draw_sliders(self.screen)

        # 🆕 NEW: Draw title
        title = self.title_font.render(
            "Fire Simulation", True, (255, 255, 255)
        )

        self.screen.blit(title, (10, 10))
