import pygame as pg


class Game:
    def __init__(self):
        pg.init()
        self.screen = pg.display.set_mode((160 * 5, (96 * 5) + 180))
        self.clock = pg.time.Clock()
        self.running = True

    def handle_events(self):
        for event in pg.event.get():
            if event.type == pg.QUIT:
                self.running = False

    def run(self):
        try:
            while self.running:
                self.handle_events()
                if not self.running:
                    break
        finally:
            pg.quit()
