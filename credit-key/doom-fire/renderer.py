"""Render the fire simulation and its user interface using Pygame."""

import pygame as pg

from settings import FIRE_WIDTH, FIRE_HEIGHT
from sliders import draw_sliders


class Renderer:
    """Manage the visual rendering of the fire simulation.

    This class handles the background, fire visualization,
    sliders, and application title displayed on the screen.
    """
    
    BACKGROUND_COLOR = (18, 19, 24)

    def __init__(self, screen):
        """Initialize the renderer and its fonts.

        Args:
            screen (pg.Surface): The main display surface where
                the simulation and interface are rendered.
        """
        self.screen = screen
        self.font = pg.font.Font(None, 23)
        self.small_font = pg.font.Font(None, 19)
        self.title_font = pg.font.Font(None, 28)

    def draw(self, colors):
        """Render the fire simulation and user interface.

        Args:
            colors (numpy.ndarray): An array containing the RGB
                color values of the fire simulation.

        Returns:
            None
        """
        # Clear the screen using the designated background color.
        self.screen.fill(self.BACKGROUND_COLOR)

        # Convert the color array into a Pygame surface.
        # Swap the axes to match Pygame's coordinate format.
        surface = pg.surfarray.make_surface(
            colors.swapaxes(0, 1)
        )
        
        # Scale the fire surface to the configured dimensions.
        surface = pg.transform.scale(
            surface, (FIRE_WIDTH, FIRE_HEIGHT)
        )
        
        # Display the fire simulation on the screen.
        self.screen.blit(surface, (0, 0))

        # Render the interactive sliders.
        draw_sliders(self.screen)

        # Render the application title in white with antialiasing.
        title = self.title_font.render(
            "Fire Simulation", True, (255, 255, 255)
        )
        
        # Position the title in the upper-left corner.
        self.screen.blit(title, (10, 10))
