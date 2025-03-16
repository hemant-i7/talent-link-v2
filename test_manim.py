from manim import *

class TestScene(Scene):
    def construct(self):
        # Create a simple circle
        circle = Circle(radius=2, color=YELLOW)
        
        # Create a title
        title = Text("Test Animation", color=WHITE).to_edge(UP)
        
        # Create equation
        equation = MathTex("x^2 + y^2 = 4", color=WHITE)
        
        # Animate
        self.play(Write(title))
        self.play(Create(circle))
        self.play(Write(equation))
        self.wait()

if __name__ == "__main__":
    config.background_color = "#000000"
    config.pixel_height = 720
    config.pixel_width = 1280
    config.frame_rate = 30
    config.media_dir = "./public/animations"
    scene = TestScene()
    scene.render() 