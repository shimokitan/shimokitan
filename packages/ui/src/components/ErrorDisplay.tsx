"use client";

import React from "react";
import Link from "next/link";
import { CyberpunkShell } from "./CyberpunkShell";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";

interface ErrorDisplayProps {
  code?: string | number;
  title: string;
  description: string;
  backToHomeLabel: string;
  statusLabel: string;
  homePath: string;
  onReset?: () => void;
  resetLabel?: string;
}

/**
 * A generalized error display component following the Shimokitan aesthetic.
 */
export const ErrorDisplay = ({
  code,
  title,
  description,
  backToHomeLabel,
  statusLabel,
  homePath,
  onReset,
  resetLabel,
}: ErrorDisplayProps) => {
  return (
    <CyberpunkShell>
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-black text-white p-6 text-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-red-600/10 rounded-full" />
              <div className="relative bg-zinc-900/50 border border-red-500/30 p-6 rounded-2xl backdrop-blur-sm animate-pulse">
                <Icon 
                  icon={code === 404 ? "lucide:search-slash" : "lucide:alert-octagon"} 
                  className="w-12 h-12 text-red-500 opacity-80" 
                />
              </div>
            </div>
          </div>

          <div className="font-mono text-xs md:text-sm text-red-500 mb-4 tracking-[0.2em] uppercase">
             [ {statusLabel} {code ? `// ${code}` : ""} ]
          </div>

          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 text-white uppercase">
            {title}
          </h1>

          <p className="max-w-md mx-auto text-zinc-400 mb-10 leading-relaxed text-sm md:text-base px-4">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {onReset && (
              <Button 
                onClick={onReset}
                variant="outline" 
                className="bg-transparent border-red-500/50 hover:bg-red-500/10 text-red-400 hover:text-red-300 group h-12 px-8 rounded-none border-t-2 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:refresh-cw" className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  {resetLabel || "RETRY_CONNECTION"}
                </div>
              </Button>
            )}
            
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
        <div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-10 whitespace-nowrap overflow-hidden pointer-events-none">
            <div className="font-mono text-[10px] tracking-widest uppercase">
                Shimokitan Archive // System_Fault // Critical_Error // Logic_Sync_Loss // Shimokitan Archive // System_Fault 
            </div>
        </div>
      </div>
    </CyberpunkShell>
  );
};
