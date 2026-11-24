import pygame as pg

from fire import Fire
from renderer import Renderer
from settings import WINDOW_SIZE, FPS, GRID_HEIGHT, GRID_WIDTH


class Game:
    def __init__(self):
        pg.init()
        self.screen = pg.display.set_mode(WINDOW_SIZE)
        pg.display.set_caption('DOOM Fire | By LT 8 and 9')
        self.clock = pg.time.Clock()
        self.renderer = Renderer(self.screen)
        self.fire = Fire(GRID_WIDTH, GRID_HEIGHT)
        self.running = True

    def handle_events(self):
        for event in pg.event.get():
            if event.type == pg.QUIT:
                self.running = False

    def run(self):
        try:
            while self.running:
                self.handle_events()
                self.fire.update()
                colors = self.fire.get_colors()
                self.renderer.draw(colors)

                pg.display.flip()
                self.clock.tick(FPS)
        finally:
            pg.quit()
