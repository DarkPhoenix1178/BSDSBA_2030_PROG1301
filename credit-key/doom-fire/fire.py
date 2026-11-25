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

        self.anchor_x = np.linspace(0, width - 1, max(2, width // 9 + 1))
        self.fuel = self.rng.uniform(0.0, 1.0, self.anchor_x.size)
        self.target_fuel = self.fuel.copy()
        self.frame = 0

    def update(self, strength=1, wind=1):
        if self.frame % 12 == 0:
            self.target_fuel = self.rng.random(self.anchor_x.size)

        self.fuel += 0.16 * (self.target_fuel - self.fuel)
        self.frame += 1

        fuel = np.interp(np.arange(self.width), self.anchor_x, self.fuel)

        self.intensity[-1] = (self.max_heat * strength * fuel).astype(np.uint8)

        heat = self.intensity[1:].astype(np.int16)

        # Horizontal Displacement due to wind
        heat = np.roll(heat, shift=wind, axis=1)

        decay = self.rng.integers(0, 3,
                                  size=(self.height - 1, self.width))

        self.intensity[:-1] = np.maximum(heat - decay, 0)

    def get_colors(self, luminosity=1.0):
        colors = self.palette[self.intensity].astype(np.float32)
        return np.clip(colors * luminosity, 0, 255).astype(np.uint8)
