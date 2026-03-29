import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, color = "emerald", isCurrency = true }) => {
    const divRef = useRef(null);
    const [opacity, setOpacity] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const colors = {
        emerald: { text: "text-emerald-400", glow: "rgba(16, 185, 129, 0.3)", border: "emerald-500" },
        red: { text: "text-red-400", glow: "rgba(239, 68, 68, 0.3)", border: "red-500" },
        blue: { text: "text-blue-400", glow: "rgba(59, 130, 246, 0.3)", border: "blue-500" },
    };

    const activeColor = colors[color] || colors.emerald;

    const handleMouseMove = (e) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative group bg-[#222836]/50 p-4 rounded-2xl border border-white/10 text-center backdrop-blur-xl overflow-hidden"
        >
            {/* 1. INTERIOR SPOTLIGHT */}
            <div
                className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${activeColor.glow}, transparent 40%)`,
                }}
            />

            {/* 2. REACTIVE BORDER (The 'Crazy' Part) */}
            <div
                className="pointer-events-none absolute -inset-px rounded-2xl border-2 border-transparent transition duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    maskImage: `radial-gradient(120px circle at ${position.x}px ${position.y}px, black, transparent)`,
                    WebkitMaskImage: `radial-gradient(120px circle at ${position.x}px ${position.y}px, black, transparent)`,
                    borderColor: `var(--tw-color-${activeColor.border})`,
                    borderImage: `radial-gradient(120px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.8), transparent) 1`,
                }}
            />

            <div className="relative z-10">
                <p className={`text-[10px] font-black uppercase mb-1 tracking-[0.15em] ${activeColor.text}`}>
                    {label}
                </p>
                <p className="text-xl font-black tracking-tighter text-white font-mono">
                    {isCurrency ? `₹${value}` : value}
                </p>
            </div>

            {/* Subtly pulse the card when recording or active */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
    );
};

export default StatCard;