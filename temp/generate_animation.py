
from manim import *
import numpy as np

config.background_color = "#000000"
config.pixel_height = 720
config.pixel_width = 1280
config.frame_rate = 30
config.media_dir = "./public/animations"

class ParabolaAnimation(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[-3, 3],
            y_range=[0, 9],
            axis_config={"color": BLUE}
        )
        
        # Create parabola y = x²
        parabola = axes.plot(lambda x: x**2, color=YELLOW)
        
        # Add title
        title = Text("Parabola y = x²", color=WHITE).to_edge(UP)
        
        # Animate
        self.play(Create(axes))
        self.play(Write(title))
        self.play(Create(parabola))
        self.wait()

if __name__ == "__main__":
    scene = ParabolaAnimation()
    scene.render()
