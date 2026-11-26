"""
Disclaimer: what happened here is that this
commit is just the foundation of the BZ reaction
so basically it can improve more such as better UI, smoother reaction, etc. 
I will add more commits myself
"""


import matplotlib.pyplot as plt
import numpy as np
from matplotlib.animation import FuncAnimation

GRID_SIZE = 200
ALPHA = 1.0
BETA = 1.0
GAMMA = 1.0


def neighbourhood_average(grid): 
    """"this one basically just averages with the 8 neighbors""" 
    """"8 since 3x3 grid so that is 9 squares in total"""
    total = np.zeros_like(grid)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            total += np.roll(np.roll(grid, dy, axis=0), dx, axis=1)
    return total / 9.0


def step(a, b, c): 
    """This function does two things, it spreads the chemicals ALPHA, BETA, GAMMA"""
    """and it also does the reaction so whoever wins grows and the other two shrinks"""
    a_avg = neighbourhood_average(a)
    b_avg = neighbourhood_average(b)
    c_avg = neighbourhood_average(c)

    new_a = a_avg + a_avg * (ALPHA * b_avg - GAMMA * c_avg)
    new_b = b_avg + b_avg * (BETA * c_avg - ALPHA * a_avg)
    new_c = c_avg + c_avg * (GAMMA * a_avg - BETA * b_avg)

    return (np.clip(new_a, 0, 1),
            np.clip(new_b, 0, 1),
            np.clip(new_c, 0, 1))




def main():
    """This part is the visualization and I made the cmap to plasma because I referred it to the BZ reaction shown in google"""
    rng = np.random.default_rng()
    a, b, c = rng.random((3, GRID_SIZE, GRID_SIZE))

    fig, ax = plt.subplots()
    image = ax.imshow(a, cmap="plasma", vmin=0, vmax=1)
    ax.set_title("Belousov-Zhabotinsky reaction")
    ax.axis("off")

    def update(_frame):
        """It just updates the image"""
        nonlocal a, b, c
        a, b, c = step(a, b, c)
        image.set_data(a)
        return (image,)

    _anim = FuncAnimation(fig, update, interval=30, blit=True,
                          cache_frame_data=False)
    plt.show()


if __name__ == "__main__":
    main()