import pygame as pg


# ============================================================
# PART 1: WORDS
# All the text shown in the control panel.
# ============================================================

STRENGTH_LABEL = "STRENGTH"
STRENGTH_LEFT = "OFF"
STRENGTH_RIGHT = "FULL"

WIND_LABEL = "WIND"
WIND_LEFT = "<< LEFT"
WIND_RIGHT = "RIGHT >>"

LUMINOSITY_LABEL = "LUMINOSITY"
LUMINOSITY_LEFT = "DIM"
LUMINOSITY_RIGHT = "BRIGHT"

KEYS_HINT = "[UP/DOWN] STRENGTH   [LEFT/RIGHT] WIND   [, .] LUMINOSITY"

PLATE_TEXT_COLOR = (40, 28, 12)     # dark letters stamped into brass
LCD_COLOR = (255, 176, 0)           # amber display digits
SCALE_COLOR = (150, 140, 128)

_fonts = {}


def get_fonts():
    # Fonts can only be made after pg.init(), so make them the first time
    if not _fonts:
        _fonts["lcd"] = pg.font.SysFont("courier", 26, bold=True)
        _fonts["plate"] = pg.font.SysFont("courier", 17, bold=True)
        _fonts["small"] = pg.font.SysFont("courier", 12, bold=True)
    return _fonts


def draw_words(screen, text, x, y, size, color, center=False, right=False):
    image = get_fonts()[size].render(text, False, color)
    if center:
        x -= image.get_width() // 2
    elif right:
        x -= image.get_width()
    screen.blit(image, (x, y))


def words_width(text, size):
    return get_fonts()[size].size(text)[0]