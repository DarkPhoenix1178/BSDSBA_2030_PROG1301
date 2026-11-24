import numpy as np

from settings import FIRE_PALETTE


class Fire:
    def __init__(self, width, height):
        self.width = width
        self.height = height

        self.intensity = np.zeros((height, width), dtype=np.uint8)
        self.palette = np.array(FIRE_PALETTE, dtype=np.uint8)
        self.max_heat = len(self.palette) - 1

    def update(self):
        self.intensity[-1] = self.max_heat

        heat = self.intensity[1:].astype(np.int16)

        self.intensity[:-1] = np.maximum(heat - 1, 0)

    def get_colors(self):
        return self.palette[self.intensity]
