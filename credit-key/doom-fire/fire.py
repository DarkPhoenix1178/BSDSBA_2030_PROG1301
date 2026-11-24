import numpy as np

from settings import FIRE_PALETTE


class Fire:
    def __init__(self, width, height, seed=None):
        self.width = width
        self.height = height

        self.intensity = np.zeros((height, width), dtype=np.uint8)
        self.palette = np.array(FIRE_PALETTE, dtype=np.uint8)
        self.max_heat = len(self.palette) - 1

        self.rng = np.random.default_rng(seed)

    def update(self):
        self.intensity[-1] = self.max_heat

        heat = self.intensity[1:].astype(np.int16)

        decay = self.rng.integers(0, 3,
                                  size=(self.height - 1, self.width))

        self.intensity[:-1] = np.maximum(heat - decay, 0)

    def get_colors(self, luminosity=1.0):
        colors = self.palette[self.intensity].astype(np.float32)
        return np.clip(colors * luminosity, 0, 255).astype(np.uint8)
