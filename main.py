import sys
import pygame
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

def rot_y(theta):
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[c, 0, -s], [0, 1, 0], [s, 0, c]])

def rotation_x(theta):
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])

def rotation_y(theta):
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])

# Phase 1: Half-Loop
pos = np.array([0.0, 0.0, 0.0])
R = np.eye(3)
positions = [pos.copy()]

for _ in range(80):
    R = R @ rot_y(np.pi / 80)
    pos = pos + R[:, 0] * (100.0 * np.pi / 80)
    positions.append(pos.copy())

# TODO: Add Phase 2 & other maneuvers here

positions = np.array(positions)

# Render plot to Pygame surface
fig = plt.figure(figsize=(8, 6))
ax = fig.add_subplot(111, projection='3d')
ax.plot(positions[:, 0], positions[:, 1], positions[:, 2], color='royalblue', label='Half-Loop')
ax.set_title("Immelmann Turn: Half-Loop Path")
ax.set_xlabel("X position")
ax.set_ylabel("Y position")
ax.set_zlabel("Altitude (Z)")
ax.legend()

fig.canvas.draw()
plot_surf = pygame.image.frombuffer(fig.canvas.buffer_rgba(), fig.canvas.get_width_height(), "RGBA")
plt.close(fig)

# Pygame loop
pygame.init()
screen = pygame.display.set_mode((1800, 1200))
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)
time = 0

while True:
    dt = clock.tick(60) / 1000
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    time += dt
    h, m, s = int(time // 3600), int(time % 3600 // 60), int(time % 60)

    screen.fill((30, 30, 30))
    screen.blit(plot_surf, (500, 300))
    screen.blit(font.render(f"{h:02}:{m:02}:{s:02}", True, "white"), (10, 10))
    pygame.display.flip()
