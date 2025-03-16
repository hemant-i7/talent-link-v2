import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import OpenAI from 'openai';

const execAsync = promisify(exec);
const DEEPSEEK_API_KEY = 'sk-ed7fa2364bc24df8bd6fc857a5b9ae24';

// Initialize DeepSeek client
const deepseek = new OpenAI({
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: DEEPSEEK_API_KEY
});

const ANIMATION_EXAMPLES = {
    simple: `
class SimpleAnimation(Scene):
    def construct(self):
        # Create basic shapes
        circle = Circle(color=YELLOW)
        square = Square(color=BLUE)
        
        # Add title
        title = Text("Basic Shapes", color=WHITE).to_edge(UP)
        
        # Simple animation sequence
        self.play(Write(title))
        self.play(Create(circle))
        self.play(Transform(circle, square))
        self.wait()`,

    graph: `
class GraphAnimation(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[-3, 3],
            y_range=[-2, 2],
            axis_config={"color": BLUE}
        )
        
        # Create function
        graph = axes.plot(lambda x: x**2/2, color=YELLOW)
        
        # Add labels
        title = Text("Quadratic Function", color=WHITE).to_edge(UP)
        
        # Animate
        self.play(Create(axes))
        self.play(Write(title))
        self.play(Create(graph))
        self.wait()`
};

async function generateManimCode(prompt: string) {
    try {
        const response = await deepseek.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: `You are a Manim expert. Generate SIMPLE and RELIABLE animation code. Follow these rules strictly:

1. Keep animations under 5 steps
2. Use only basic shapes and transformations
3. Include only essential elements
4. Use simple colors (YELLOW, BLUE, WHITE)
5. Keep animations short (under 10 seconds)
6. Use basic Text and MathTex only when necessary
7. Focus on one concept at a time

Example of a good simple animation:

\`\`\`python
${ANIMATION_EXAMPLES.simple}
\`\`\`

Example of a graph animation:

\`\`\`python
${ANIMATION_EXAMPLES.graph}
\`\`\`

Generate similar SIMPLE code for: ${prompt}`
                },
                {
                    role: "user",
                    content: `Create a simple Manim animation for: ${prompt}. Keep it basic and reliable.`
                }
            ],
            temperature: 0.3,
            max_tokens: 1000
        });

        if (!response.choices[0]?.message?.content) {
            throw new Error('No content in API response');
        }

        // Extract code from the response
        const content = response.choices[0].message.content;
        const codeMatch = content.match(/```python\n([\s\S]*?)```/) || content.match(/```([\s\S]*?)```/);

        if (!codeMatch) {
            console.error('Full API response:', content);
            throw new Error('No code found in the response');
        }

        // Add config settings to the code
        return `
from manim import *
import numpy as np

config.background_color = "#000000"
config.pixel_height = 720
config.pixel_width = 1280
config.frame_rate = 30
config.media_dir = "./public/animations"

${codeMatch[1].trim()}

if __name__ == "__main__":
    scene = ${codeMatch[1].match(/class\s+(\w+)/)?.[1] || 'Scene'}()
    scene.render()
`;
    } catch (error) {
        console.error('Error in generateManimCode:', error);
        throw error;
    }
}

async function getVideoDuration(videoPath: string): Promise<number> {
    try {
        const { stdout } = await execAsync(
            `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
        );
        return parseFloat(stdout);
    } catch (error) {
        console.error('Error getting video duration:', error);
        return 0;
    }
}

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        console.log('Processing prompt:', prompt);

        // Clean up old files
        const tempDir = path.join(process.cwd(), 'temp');
        const publicAnimDir = path.join(process.cwd(), 'public', 'animations');

        try {
            await fs.rm(tempDir, { recursive: true, force: true });
            await fs.rm(publicAnimDir, { recursive: true, force: true });
        } catch (error) {
            console.log('Clean up error (non-fatal):', error);
        }

        // Create fresh directories
        await fs.mkdir(tempDir, { recursive: true });
        await fs.mkdir(publicAnimDir, { recursive: true });

        // Generate and save the code
        let manimCode;
        try {
            manimCode = await generateManimCode(prompt);
            console.log('Generated Manim code:', manimCode);
        } catch (error) {
            console.error('Failed to generate Manim code:', error);
            return NextResponse.json(
                { error: 'Failed to generate animation code. Please try a different prompt.' },
                { status: 500 }
            );
        }

        // Write Python script
        const scriptPath = path.join(tempDir, 'generate_animation.py');
        await fs.writeFile(scriptPath, manimCode);

        console.log('Starting Python script execution...');

        // Execute Python script with timeout
        try {
            const { stdout, stderr } = await execAsync(`python "${scriptPath}"`, { timeout: 20000 });
            console.log('Python Output:', stdout);
            if (stderr) console.error('Python Errors:', stderr);
        } catch (error) {
            console.error('Python execution error:', error);
            return NextResponse.json(
                { error: 'Failed to render animation. Please try a simpler concept.' },
                { status: 500 }
            );
        }

        // Look for the generated video
        const possiblePaths = [
            path.join(publicAnimDir, 'videos', '720p30'),
            path.join(publicAnimDir, 'videos', '1080p60'),
            publicAnimDir
        ];

        let videoPath = null;
        let videoUrl = null;

        for (const dir of possiblePaths) {
            try {
                await fs.mkdir(dir, { recursive: true });
                const files = await fs.readdir(dir);
                const videoFile = files.find(f => f.endsWith('.mp4'));
                if (videoFile) {
                    videoPath = path.join(dir, videoFile);
                    const relativePath = path.relative(path.join(process.cwd(), 'public'), path.join(dir, videoFile));
                    videoUrl = '/' + relativePath.replace(/\\/g, '/');
                    break;
                }
            } catch (error) {
                console.log(`No videos found in ${dir}`);
            }
        }

        if (videoPath && videoUrl) {
            console.log('Video file found at:', videoPath);
            console.log('Video URL:', videoUrl);

            // Get video duration
            const duration = await getVideoDuration(videoPath);

            return NextResponse.json({
                videoUrl,
                duration,
                message: `Animation created successfully (${duration.toFixed(1)} seconds)`
            });
        } else {
            console.error('No video file found in any of the expected locations');
            return NextResponse.json(
                { error: 'Animation was generated but video file not found' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
} 