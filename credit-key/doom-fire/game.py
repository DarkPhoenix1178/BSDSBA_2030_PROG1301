import pygame as pg

from fire import Fire
from renderer import Renderer
from settings import WINDOW_SIZE, FPS, SIMULATION_FPS, GRID_HEIGHT, GRID_WIDTH


class Game:
    def __init__(self):
        pg.init()
        self.screen = pg.display.set_mode(WINDOW_SIZE)
        pg.display.set_caption('DOOM Fire | By LT 8 and 9')
        self.clock = pg.time.Clock()
        self.renderer = Renderer(self.screen)
        self.fire = Fire(GRID_WIDTH, GRID_HEIGHT)
        self.running = True
        self.wind = -1.0
        self.strength = 1.0

        # FPS limiter
        # The screen draws 60 times per second (FPS),
        # but the fire only updates 30 times per second (SIMULATION_FPS).
        # 60 // 30 = 2, so the fire updates once every 2 screen frames.
        self.frame_count = 0
        self.update_every = FPS // SIMULATION_FPS

    def handle_events(self):
        for event in pg.event.get():
            if event.type == pg.QUIT:
                self.running = False

            if event.type == pg.KEYUP:
                if event.scancode == 82:  # UP
                    self.strength += 0.1 if self.strength <= 0.9 else 0
                elif event.scancode == 81:  # DOWN
                    self.strength -= 0.1 if self.strength >= 0 else 0
                elif event.scancode == 80:  # LEFT
                    self.wind -= 0.1 if self.wind >= -1.9 else 0
                elif event.scancode == 79:  # RIGHT
                    self.wind += 0.1 if self.wind <= 1.9 else 0

    def run(self):
        try:
            while self.running:
                self.handle_events()

                # Only update the fire on every 2nd frame
                if self.frame_count % self.update_every == 0:
                    self.fire.update(self.strength, self.wind)
                self.frame_count += 1

                colors = self.fire.get_colors()
                self.renderer.draw(colors)

                pg.display.flip()
                self.clock.tick(FPS)
        finally:
            pg.quit()
