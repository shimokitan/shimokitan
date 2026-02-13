"use client"

import React from "react"

export const CyberpunkStyles = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
        .bg-noise {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 50;
            opacity: 0.05;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .scanlines {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0) 0px,
                rgba(0, 0, 0, 0) 1px,
                rgba(0, 0, 0, 0.1) 1px,
                rgba(0, 0, 0, 0.1) 2px
            );
            pointer-events: none;
            z-index: 45;
        }

        .cyber-grid {
            background-image: linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px);
            background-size: 20px 20px;
        }

        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }

        .hover-glitch:hover {
            animation: glitch 0.3s infinite;
        }

        @keyframes flicker {
            0% { opacity: 0.8; }
            5% { opacity: 0.9; }
            10% { opacity: 0.8; }
            15% { opacity: 1; }
            20% { opacity: 0.8; }
            25% { opacity: 0.9; }
            30% { opacity: 1; }
            70% { opacity: 0.9; }
            100% { opacity: 1; }
        }

        .animate-flicker {
            animation: flicker 4s infinite step-end;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(1deg); }
        }

        .animate-float {
            animation: float 4s ease-in-out infinite;
        }

        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.2); }
            50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.5); }
        }

        .pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
        }
    `}} />
)

export const CyberpunkShell = ({ children }: { children: React.ReactNode }) => (
    <>
        <CyberpunkStyles />
        <div className="bg-noise" />
        <div className="scanlines" />
        {children}
    </>
)
