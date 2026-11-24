import pygame as pg

from renderer import Renderer
from settings import WINDOW_SIZE, FPS


class Game:
    def __init__(self):
        pg.init()
        self.screen = pg.display.set_mode(WINDOW_SIZE)
        pg.display.set_caption('DOOM Fire | By LT 8 and 9')
        self.clock = pg.time.Clock()
        self.renderer = Renderer(self.screen)
        self.running = True

    def handle_events(self):
        for event in pg.event.get():
            if event.type == pg.QUIT:
                self.running = False

    def run(self):
        try:
            while self.running:
                self.handle_events()
                self.renderer.draw()

                pg.display.flip()
                self.clock.tick(FPS)
        finally:
            pg.quit()
