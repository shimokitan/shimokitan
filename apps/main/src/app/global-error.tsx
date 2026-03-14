"use client";

import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Extreme fallback error handler for the entire application.
 * Required by Next.js to catch errors in the root layout.
 * 
 * @param props - Component props containing error object and reset function
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-black text-white`}>
        <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 text-center">
            <div className="font-mono text-red-500 mb-4 animate-pulse uppercase tracking-widest text-sm">
                [ CRITICAL_SYSTEM_FAULT ]
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tighter">
                Logic Core Offline
            </h1>
            <p className="text-zinc-500 max-w-md mb-8 text-sm">
                The District's foundational architecture encountered an unrecoverable breach. 
                System resonance has been lost.
            </p>
            <button
                onClick={() => reset()}
                className="px-8 h-12 bg-white text-black font-bold uppercase text-xs hover:bg-zinc-200 transition-colors"
            >
                Attempt Reboot
            </button>
        </div>
      </body>
    </html>
  );
}
