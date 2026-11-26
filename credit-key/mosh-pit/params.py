"""Model parameters for the mosh pit simulation.

All values come from the Parameters table in mosh-pit-prerequisite.md.
Keeping them in one file means the simulation can import them instead
of typing the numbers again. Run this file to print them.
"""

import numpy as np

# Crowd size
N = 500          # total number of MASHers
N_ACTIVE = 150   # how many of them are active

# Body and movement
R0 = 1.0         # radius of one MASHer
V0 = 1.0         # preferred speed of an active MASHer
EPSILON = 100.0  # strength of the "don't overlap" push
MU = 0.05        # how quickly a MASHer returns to its preferred speed
R_FLOCK = 4.0    # radius in which a MASHer follows its neighbours

# These two were varied in the study, so these are starting values
ALPHA = 1.0      # flocking strength, studied from 0 to 5
NOISE_STD = 1.0  # strength of the random push, studied from 0 to 3

# Size of the square box, chosen so the crowd fills about 94% of it
BOX_LENGTH = 1.03 * np.sqrt(np.pi * R0 ** 2 * N)
PACKING_FRACTION = N * np.pi * R0 ** 2 / BOX_LENGTH ** 2

# Time scales from the set-up notes
TAU_PROP = 1 / MU        # time to settle back to the preferred speed
TAU_FLOCK = V0 / ALPHA   # time for flocking to turn a MASHer


if __name__ == '__main__':
    print('MASHers: %d (%d active, %d passive)'
          % (N, N_ACTIVE, N - N_ACTIVE))
    print('Box length: %.1f' % BOX_LENGTH)
    print('Packing fraction: %.2f' % PACKING_FRACTION)
    print('Self-propulsion time scale: %.1f' % TAU_PROP)
    print('Flocking time scale: %.1f' % TAU_FLOCK)
