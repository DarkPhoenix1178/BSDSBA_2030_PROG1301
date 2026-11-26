import numpy as np

from settings import FIRE_PALETTE


class Fire:
    def __init__(self, width, height, seed=None):
        self.width = width
        self.height = height

        self.intensity = np.zeros((height, width), dtype=np.float32)
        self.palette = np.array(FIRE_PALETTE, dtype=np.uint8)
        self.max_heat = len(self.palette) - 1

        self.rng = np.random.default_rng(seed)

        self.anchor_x = np.linspace(0, width - 1, max(2, width // 9 + 1))
        self.fuel = self.rng.uniform(0.0, 1.0, self.anchor_x.size)
        self.target_fuel = self.fuel.copy()
        self.frame = 0

    def update(self, strength=1, wind=0):
        if strength <= 0:
            self.intensity.fill(0)
            return

        if self.frame % 12 == 0:
            self.target_fuel = self.rng.random(self.anchor_x.size)

        # Transition rate * difference
        self.fuel += 0.16 * (self.target_fuel - self.fuel)
        self.frame += 1

        fuel = np.interp(np.arange(self.width), self.anchor_x, self.fuel)

        # Source Temperature
        # Make the minimum source heat become between 0.25 and 1.00
        min_strength_heat = 0.25
        min_fuel_heat = 0.72

        source_heat = self.max_heat * (
                min_strength_heat + (1 - min_strength_heat) * strength
        )

        base_heat = source_heat * (
                min_fuel_heat + (1 - min_fuel_heat) * fuel
        )

        # Flame Height
        peak_height = (self.height - 1) * (0.04 + 0.96 * strength)

        local_height = np.maximum(
            1.0, peak_height * (0.28 + 1.12 * fuel)
        )

        # Cooling
        cooling = base_heat / local_height

        self.intensity[-1] = base_heat

        heat = self.intensity[1:]

        # Turbulence
        turbulence = self.rng.choice(
            [-1, 0, 1],
            size=heat.shape,
            p=[0.25, 0.50, 0.25]
        )

        columns = np.arange(self.width)

        # Wind
        displacement = np.floor(
            2.0 * wind + self.rng.random(heat.shape)
        ).astype(int)

        source_x = columns - turbulence - displacement

        # Identify valid source coordinates
        if wind > 0:
            valid = source_x >= 0
        elif wind < 0:
            valid = source_x < self.width
        else:
            valid = (source_x >= 0) & (source_x < self.width)

        # Prevent indexing errors
        source_x = np.clip(source_x, 0, self.width - 1)

        heat = np.take_along_axis(heat, source_x, axis=1)

        # Remove heat coming from outside the grid
        heat = np.where(valid, heat, 0)

        decay = cooling * self.rng.uniform(
            0.75, 1.25, size=(self.height - 1, self.width)
        )

        self.intensity[:-1] = np.maximum(heat - decay, 0)

    def get_colors(self, luminosity=1.0):
        indices = np.clip(
            self.intensity, 0, self.max_heat
        ).astype(np.uint8)

        colors = self.palette[indices].astype(np.float32)
        return np.clip(colors * luminosity, 0, 255).astype(np.uint8)
