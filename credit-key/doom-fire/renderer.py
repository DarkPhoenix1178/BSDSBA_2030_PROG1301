import pygame as pg


class Renderer:
    def __init__(self, screen):
        self.screen = screen
        self.font = pg.font.Font(None, 23)
        self.small_font = pg.font.Font(None, 19)
        self.title_font = pg.font.Font(None, 28)

    def draw(self):
        self.screen.fill((18, 19, 24))
