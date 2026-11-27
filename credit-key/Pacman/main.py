import pygame, sys

from game import Game

from settings import FPS


pygame.init()

running = True

game = Game()
clock = pygame.time.Clock()

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == pygame.KEYDOWN:
            if (game.status != "PLAYING" and event.key == pygame.K_r):
                game.reset_game()

            elif event.key == pygame.K_p:
                if game.status == "PLAYING":
                    game.status = "PAUSED"

                elif game.status == "PAUSED":
                    game.status = "PLAYING"

    game.handle_input()

    game.update()

    game.draw()

    clock.tick(FPS)

pygame.quit()
