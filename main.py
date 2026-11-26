import pygame, sys

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
    screen.blit(font.render(f"{h:02}:{m:02}:{s:02}", True, "white"), (10, 10))
    pygame.display.flip()

def rotation_x(theta):
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])

def rotation_y(theta):
    c,s = np.cos(theta), np.sin(theta)
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])

