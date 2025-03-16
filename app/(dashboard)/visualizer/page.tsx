"use client";

import { ArrowRight, Play, Sparkles, Video, Lightbulb, History, Bookmark } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

export default function Visualizer() {
    const [prompt, setPrompt] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Update suggestions with real-world examples
    const getSuggestions = (input: string) => {
        const allSuggestions = [
            "Show how a simple pendulum oscillates with its period formula",
            "Demonstrate wave propagation and interference in water",
            "Visualize projectile motion of a basketball shot",
            "Show how gears with different ratios rotate together",
            "Demonstrate how a car's position changes with constant acceleration",
            "Visualize how springs oscillate with Hooke's law",
            "Show how sound waves combine to create music harmonics",
            "Demonstrate how planets orbit the sun using Kepler's laws"
        ];
        return input.length > 0
            ? allSuggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()))
            : allSuggestions.slice(0, 3);
    };

    const handleVisualize = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await fetch('/api/generate-animation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();
            if (data.error) {
                setError(data.error);
            } else {
                setVideoUrl(data.videoUrl);
                setMessage(data.message);
            }
        } catch (error) {
            setError('Failed to generate animation');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-black/5 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0">
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black opacity-90" />

                {/* Grid pattern */}
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, rgba(223, 254, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(223, 254, 0, 0.05) 1px, transparent 1px)
            `,
                        backgroundSize: '64px 64px'
                    }}
                />

                {/* Radial gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#DFFE00]/5 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-8 py-16">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl font-bold text-white tracking-tight">
                        Math <span className="text-[#DFFE00]">Visualizer</span>
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg">
                        Enter any mathematical concept or problem to see it visualized
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mb-16 space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Describe the mathematical concept you want to visualize..."
                            className="w-full px-8 py-6 bg-black/50 text-white rounded-2xl 
                                   border border-[#DFFE00]/10 backdrop-blur-sm
                                   focus:border-[#DFFE00]/30 focus:outline-none focus:ring-2 
                                   focus:ring-[#DFFE00]/10 text-lg"
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value);
                                setSuggestions(getSuggestions(e.target.value));
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && prompt.trim()) {
                                    handleVisualize();
                                }
                            }}
                        />
                        <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 
                                     bg-[#DFFE00] text-black rounded-xl font-medium 
                                     hover:shadow-[0_0_30px_rgba(223,254,0,0.3)] 
                                     transition-all duration-300 flex items-center gap-2
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleVisualize}
                            disabled={loading || !prompt.trim()}
                        >
                            <Sparkles className="h-5 w-5" />
                            {loading ? 'Generating...' : 'Visualize'}
                        </button>
                    </div>

                    {/* Video Result Section - Moved directly below input */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500">
                            {error}
                        </div>
                    )}
                    {loading && (
                        <div className="bg-black/50 rounded-xl border border-[#DFFE00]/10 p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#DFFE00] border-t-transparent mx-auto mb-4"></div>
                            <p className="text-white/50">Generating your visualization...</p>
                        </div>
                    )}
                    {videoUrl && !loading && (
                        <div className="bg-black/50 rounded-xl border border-[#DFFE00]/10 p-6 backdrop-blur-sm">
                            <video
                                controls
                                className="w-full rounded-xl"
                                src={videoUrl}
                                autoPlay
                                loop
                            >
                                Your browser does not support the video tag.
                            </video>
                            {/* Download Button */}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = videoUrl;
                                        link.download = 'math-visualization.mp4';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    className="px-6 py-3 bg-[#DFFE00] text-black rounded-xl font-medium 
                                             hover:shadow-[0_0_30px_rgba(223,254,0,0.3)] 
                                             transition-all duration-300 flex items-center gap-2"
                                >
                                    <Video className="h-5 w-5" />
                                    Download Video
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="mt-2 bg-black/50 rounded-xl border border-[#DFFE00]/10 p-3 backdrop-blur-sm">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    className="w-full text-left px-6 py-3 text-white/50 hover:text-[#DFFE00] 
                                             hover:bg-[#DFFE00]/5 rounded-lg transition-colors flex items-center gap-3"
                                    onClick={() => setPrompt(suggestion)}
                                >
                                    <Lightbulb className="h-4 w-4" />
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions - Moved below video section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { icon: History, text: "Recent Visualizations" },
                        { icon: Bookmark, text: "Saved Explanations" },
                        { icon: Play, text: "Tutorial Videos" }
                    ].map((action, index) => (
                        <button key={index}
                            className="p-6 bg-black/50 rounded-2xl border border-[#DFFE00]/10 
                             hover:border-[#DFFE00]/30 transition-all duration-300 group
                             backdrop-blur-sm">
                            <div className="flex items-center gap-4 text-white">
                                <action.icon className="h-6 w-6 text-[#DFFE00]" />
                                <span className="text-lg">{action.text}</span>
                                <ArrowRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 