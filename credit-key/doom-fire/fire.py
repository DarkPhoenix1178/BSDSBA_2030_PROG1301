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

        # Swirl mode setup (only used by update_swirl)
        # Cell coordinates for every row except the bottom (fuel) row
        self.swirl_y, self.swirl_x = np.mgrid[
            0:height - 1, 0:width
        ].astype(np.float32)

        # 0.0 at the bottom of the fire, 1.0 at the top.
        # Eddies are weak near the fuel and grow stronger as the flame rises.
        height_norm = 1.0 - self.swirl_y / max(1, height - 1)
        self.swirl_height_factor = 0.3 + 0.7 * height_norm

        # Layered eddies, from big slow curls to small fast ones.
        # Each layer is one sine/cosine wave pattern in the stream function.
        # (wavelength in cells, max speed in cells per frame)
        layer_specs = [(56, 1.3), (32, 0.9), (18, 0.6), (10, 0.35)]
        self.swirl_layers = []
        for wavelength, speed in layer_specs:
            k = 2 * np.pi / wavelength
            self.swirl_layers.append({
                # Slightly different x and y scales so eddies aren't round
                'kx': k * self.rng.uniform(0.7, 1.3),
                'ky': k * self.rng.uniform(0.7, 1.3),
                'amp': speed / k,
                'phase_x': self.rng.uniform(0, 2 * np.pi),
                'phase_y': self.rng.uniform(0, 2 * np.pi),
                # How fast the pattern sways sideways (radians per frame)
                'drift_x': self.rng.uniform(-0.05, 0.05),
                # How fast the pattern rises with the flame (cells per frame)
                'rise': self.rng.uniform(0.4, 1.0),
            })

    def update(self, strength=1, wind=1):
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

    def swirl_field(self, t):
        """
        2D swirl (velocity) field at time t using curl noise
        made from layered sine/cosine waves

        psi = sum of amp * sin(kx*x + px) * cos(ky*y + py)

        curl gives the velocity:
            vx =  d(psi)/dy
            vy = -d(psi)/dx

        """
        vx = np.zeros_like(self.swirl_x)
        vy = np.zeros_like(self.swirl_y)

        for layer in self.swirl_layers:
            kx, ky, amp = layer['kx'], layer['ky'], layer['amp']

            # Animate: sway sideways and drift upward with the flame
            # (y grows downward, so adding to y moves the pattern up)
            ax = kx * self.swirl_x + layer['phase_x'] + layer['drift_x'] * t
            ay = ky * (self.swirl_y + layer['rise'] * t) + layer['phase_y']

            vx += -amp * ky * np.sin(ax) * np.sin(ay)
            vy += -amp * kx * np.cos(ax) * np.cos(ay)

        return vx, vy

    def update_swirl(self, strength=1, wind=0, swirl=1.0):
        """
        instead of every cell copying from the
        cell straight below/beside it, 
        it copies from a spot chosen by a
        moving swirl field, so the flames curl and eddy.

        strength : flame strength, 0..1 (same as update)
        wind     : global drift added on top of the swirls (same as update)
        swirl    : how strong the eddies are (0 = no swirl)
        """
        if strength <= 0:
            self.intensity.fill(0)
            return

        # Fuel and source heat (same as classic mode)
        if self.frame % 12 == 0:
            self.target_fuel = self.rng.random(self.anchor_x.size)

        self.fuel += 0.16 * (self.target_fuel - self.fuel)
        self.frame += 1

        fuel = np.interp(np.arange(self.width), self.anchor_x, self.fuel)

        min_strength_heat = 0.25
        min_fuel_heat = 0.72

        source_heat = self.max_heat * (
                min_strength_heat + (1 - min_strength_heat) * strength
        )
        base_heat = source_heat * (
                min_fuel_heat + (1 - min_fuel_heat) * fuel
        )

        peak_height = (self.height - 1) * (0.04 + 0.96 * strength)
        local_height = np.maximum(
            1.0, peak_height * (0.28 + 1.12 * fuel)
        )
        cooling = base_heat / local_height

        self.intensity[-1] = base_heat

        # Swirl field for this frame
        vx, vy = self.swirl_field(self.frame)
        vx *= swirl * self.swirl_height_factor
        vy *= swirl * self.swirl_height_factor

        # Where does each cell pull its heat from?
        # Horizontal: classic turbulence + wind + swirl
        turbulence = self.rng.choice(
            [-1, 0, 1],
            size=vx.shape,
            p=[0.25, 0.50, 0.25]
        )
        src_x = self.swirl_x - turbulence - (2.0 * wind + vx)

        # Vertical: normally the row directly below (y + 1), like DOOM.
        # The swirl can nudge it, but it's clamped so heat always comes
        # from at or below the current row -> fire still rises.
        src_y = self.swirl_y + 1 + np.clip(vy, -0.6, 1.2)

        # Random rounding 
        src_x = np.floor(src_x + self.rng.random(vx.shape)).astype(int)
        src_y = np.floor(src_y + self.rng.random(vy.shape)).astype(int)

        # Heat from outside the left/right edges is treated as cold
        valid = (src_x >= 0) & (src_x < self.width)

        src_x = np.clip(src_x, 0, self.width - 1)
        src_y = np.clip(src_y, 0, self.height - 1)

        # Read from the previous frame (copy), then write the new frame
        heat = self.intensity[src_y, src_x]
        heat = np.where(valid, heat, 0)

        # Same random cooling as classic mode
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
