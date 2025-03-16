"use client";

import Link from "next/link";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Brain,
  Mic,
  Code,
  Video,
  Layers,
  LogOut,
  Wallet,
} from "lucide-react";
import { useState, useEffect } from "react";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "AR Learning",
    icon: Compass,
    href: "/ar-learning",
  },
  {
    label: "AI Voice Assistant",
    icon: Mic,
    href: "/voice-assistant",
  },
  {
    label: "Practice Sessions",
    icon: Code,
    href: "/practice",
  },
  {
    label: "AI Visualizer",
    icon: Video,
    href: "/visualizer",
  },
  {
    label: "AI Quiz Generator",
    icon: Brain,
    href: "/quiz",
  }
];

const Sidebar = () => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative h-full overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#1a1a1a] opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#DFFE00]/10 to-transparent" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(223, 254, 0, 0.1) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-4 py-4 flex flex-col h-full backdrop-blur-sm">
        <div className="px-6 py-2 flex-1">
          {/* Logo Section with Animation */}
          <div className="flex flex-col items-center justify-center mb-8 text-center">
            <h1
              className={cn(
                "text-4xl font-bold text-[#DFFE00] ",
                mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                montserrat.className
              )}
            >
              NYC
            </h1>
            <span
              className={cn(
                "text-xs text-white/70 mt-1 transition-all duration-700",
                mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              not your class
            </span>
          </div>

          {/* Wallet Connect Button */}
          <button
            className="relative w-full mb-8 px-4  py-3 bg-[#212121] hover:bg-[#DFFE00] rounded-lg 
                     flex items-center justify-center gap-2 text-white hover:text-black font-medium 
                     transition-all duration-300 hover:shadow-[0_0_15px_rgba(223,254,0,0.5)]
                     border border-[#DFFE00]/20 group"
          >
            <Wallet className="h-5 w-5 relative z-10" />
            <span className="relative z-10">Wallet Connect</span>
          </button>

          {/* Navigation Links */}
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "relative w-full text-[15px] flex p-3 gap-3 mb-4 items-center font-medium cursor-pointer rounded-lg transition-all duration-300 border border-[#DFFE00]/20 group ",
                  pathname === route.href
                    ? "bg-[#DFFE00] text-black border-[#DFFE00] shadow-[0_0_15px_rgba(223,254,0,0.5)]"
                    : "text-white  bg-[#212121] hover:bg-[#DFFE00] border border-[#DFFE00]/20 group hover:text-black hover:shadow-[0_0_15px_rgba(223,254,0,0.5)]"
                )}
              >
                <route.icon className="h-5 w-5" />
                <span>{route.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-6">
          <button
            className="relative w-full p-3 flex items-center gap-3 text-white bg-[#212121] 
                     hover:bg-[#DFFE00] hover:text-black rounded-lg transition-all duration-300 
                     hover:shadow-[0_0_15px_rgba(223,254,0,0.5)] border border-[#DFFE00]/20"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
