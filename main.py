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