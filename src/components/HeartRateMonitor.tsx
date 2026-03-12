import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HeartRateMonitorProps {
    initialBpm?: number;
    className?: string;
}

export default function HeartRateMonitor({ initialBpm = 72, className }: HeartRateMonitorProps) {
    const [bpm, setBpm] = useState(initialBpm);

    useEffect(() => {
        const interval = setInterval(() => {
            setBpm((prev) => {
                const delta = Math.floor(Math.random() * 3) - 1;
                return Math.max(60, Math.min(100, prev + delta));
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const duration = 60 / bpm;

    return (
        <div className={cn("flex flex-col items-center justify-center", className)}>
            <div className="relative group cursor-pointer transition-transform">
                {/* Single soft radial glow */}
                <div className="absolute inset-[-40px] bg-[#f43f5e] rounded-full blur-[40px] opacity-15" />
                <div className="absolute inset-[-20px] bg-[#f43f5e] rounded-full blur-[25px] opacity-25" />
                
                {/* Main Heart Container */}
                <div className="relative flex items-center justify-center w-44 h-44">
                    <motion.div
                        animate={{
                            scale: [1, 1.08, 1],
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative z-10"
                    >
                        <div className="bg-white/10 rounded-full p-6 backdrop-blur-sm">
                            <Heart
                                className="w-36 h-36 text-[#f43f5e] fill-[#f43f5e] drop-shadow-[0_4px_15px_rgba(244,63,94,0.3)]"
                                strokeWidth={1}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
            
            <div className="mt-4 flex flex-col items-center">
                <div className="flex items-baseline gap-1">
                    <span className="text-[44px] font-black text-[#1e293b] leading-none">{bpm} BPM</span>
                </div>
                <span className="text-xs font-black text-[#94a3b8] uppercase tracking-[0.2em] mt-2">Normal</span>
            </div>
        </div>
    );
}
