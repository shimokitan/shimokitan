"use client";

import React from "react";
import Link from "next/link";
import { CyberpunkShell } from "./CyberpunkShell";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";

interface NotFoundProps {
  title: string;
  description: string;
  backToHomeLabel: string;
  statusLabel: string;
  homePath: string;
}

export const NotFound = ({
  title,
  description,
  backToHomeLabel,
  statusLabel,
  homePath,
}: NotFoundProps) => {
  return (
    <CyberpunkShell>
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-black text-white p-6 text-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-violet-600/20 rounded-full" />
              <div className="relative bg-zinc-900/50 border border-violet-500/30 p-6 rounded-2xl backdrop-blur-sm animate-float">
                <Icon icon="lucide:wifi-off" className="w-12 h-12 text-violet-400 opacity-80" />
              </div>
            </div>
          </div>

          <div className="font-mono text-xs md:text-sm text-violet-500 mb-4 tracking-[0.2em] animate-pulse uppercase">
             [ {statusLabel} ]
          </div>

          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 uppercase">
            {title}
          </h1>

          <p className="max-w-md mx-auto text-zinc-400 mb-10 leading-relaxed text-sm md:text-base px-4">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
                asChild 
                variant="outline" 
                className="bg-transparent border-zinc-800 hover:bg-zinc-900 hover:text-white group h-12 px-8 rounded-none border-t-2 border-t-violet-500/50 transition-all duration-300"
            >
              <Link href={homePath} className="flex items-center gap-2">
                <Icon icon="lucide:arrow-left" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {backToHomeLabel}
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer info/deco */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-20 whitespace-nowrap overflow-hidden pointer-events-none">
            <div className="font-mono text-[10px] tracking-widest uppercase">
                Shimokitan Archive // Sector_Null // Encryption_Active // Frequency_Lost // Shimokitan Archive // Sector_Null 
            </div>
        </div>
      </div>
    </CyberpunkShell>
  );
};
