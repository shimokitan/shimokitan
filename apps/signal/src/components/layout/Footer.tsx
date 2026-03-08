import React from 'react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-card mt-auto transition-colors duration-300">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3 opacity-80 backdrop-grayscale hover:backdrop-grayscale-0 transition-all duration-300">
                            <div className="w-3 h-3 bg-foreground rounded-sm rotate-45" />
                            <div className="flex flex-col leading-none">
                                <span className="font-black tracking-tighter text-lg italic uppercase text-foreground">SHIMOKITAN</span>
                                <span className="text-muted-foreground text-[10px] font-mono tracking-[0.3em] font-bold">SIGNAL_TERMINAL</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm font-mono mt-4">
                            System status and actionable anomaly reports across the district.
                            Operating under nominal capacity unless otherwise noted.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground/70 mb-2">District Links</span>
                        <a href="https://shimokitan.live/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">About District</a>
                        <a href="https://shimokitan.live/artists" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">Artists</a>
                        <a href="https://shimokitan.live/zines" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">Echo Pulse</a>
                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground/70 mb-2">Legal Transmissions</span>
                        <a href="https://shimokitan.live/legal/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">Privacy Protocol</a>
                        <a href="https://shimokitan.live/legal/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">Terms of Service</a>
                        <a href="https://shimokitan.live/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">Contact Routing</a>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} SHIMOKITAN // ALL_RIGHTS_RESERVED
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-status-resolved animate-pulse" />
                        <span className="text-[10px] font-mono text-status-resolved font-bold tracking-widest uppercase">System Normal</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
