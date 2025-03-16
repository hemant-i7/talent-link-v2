from manim import *

class SimpleScene(Scene):
    def construct(self):
        # Create a simple circle
        circle = Circle(color=YELLOW)
        
        # Add a title
        title = Text("Test Animation", color=WHITE).to_edge(UP)
        
        # Simple animation sequence
        self.play(Write(title))
        self.play(Create(circle))
        self.wait()

config.background_color = "#000000"
config.pixel_height = 720
config.pixel_width = 1280
config.frame_rate = 30
config.media_dir = "./public/animations"

if __name__ == "__main__":
    scene = SimpleScene()
    scene.render() 