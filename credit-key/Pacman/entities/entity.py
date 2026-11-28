import pygame
class Entity:

    def __init__(self, x, y, size, speed, direction):
        self.x = x
        self.y = y
        self.spawn_x = x
        self.spawn_y = y

        self.size = size
        self.speed = speed

        self.direction = direction

    @property
    def rect(self):

        return pygame.Rect(
            self.x,
            self.y,
            self.size,
            self.size
        )

    def move(self):

        if self.direction == "UP":
            self.y -= self.speed

        elif self.direction == "DOWN":
            self.y += self.speed

        elif self.direction == "LEFT":
            self.x -= self.speed

        elif self.direction == "RIGHT":
            self.x += self.speed

        elif None:
            self.x += 0
            self.y += 0

    def next_move(self, direction):

        if direction == "UP":
            return self.x, self.y - self.speed, self.size

        if direction == "DOWN":
            return self.x, self.y + self.speed, self.size

        if direction == "LEFT":
            return self.x - self.speed, self.y, self.size

        if direction == "RIGHT":
            return self.x + self.speed, self.y, self.size

        if direction == None:
            return self.x, self.y, self.size
