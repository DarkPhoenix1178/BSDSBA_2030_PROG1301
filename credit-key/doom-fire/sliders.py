import pygame as pg

def draw_sliders(screen):
  pg.draw.rect(screen, (200, 200, 200), (50, 50, 200, 10))
  pg.draw.circle(screen, (255, 0, 0), (100, 55), 10)

class Slider:
  def __init__(self, label, x, y, width, min_val, max_val, value):
    self.label = label
    self.track = pg.Rect(x, y, width, 10)
    self.min_val = min_val
    self.max_val = max_val
    self.value = value
    self.radius = 10
    self.dragging = False

  def knob_x(self):
    ratio = (self.value - self.min_val) / (self.max_val - self.min_val)
    return self.track.x + int(ratio * self.track.width)
