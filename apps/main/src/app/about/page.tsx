
import React from 'react';
import { Badge } from '@shimokitan/ui';

export default function AboutPage() {
    return (
        <div className="space-y-8">
            <header className="border-b border-zinc-800 pb-8 mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Badge variant="violet" className="text-violet-500 border-violet-500/30">Introduction</Badge>
                    <span className="text-xs text-zinc-500 font-mono">LAST_UPDATED: 2026-02-15</span>
                </div>
                <h1 className="text-5xl md:text-7xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                    What is Shimokitan?
                </h1>
                <p className="text-xl text-zinc-400 font-light max-w-2xl">
                    A digital district forged from the noise of the streets and the silence of the void.
                </p>
            </header>

            <section className="space-y-6">
                <p>
                    Shimokitan is not just a platform; it is a repository of cultural artifacts, a living archive of the underground.
                    Inspired by the vibrant chaos of Shimokitazawa and the sterile beauty of brutalist architecture, we aim to document the resonance of modern subcultures.
                </p>
                <p>
                    From anime aesthetics to lo-fi beats, from obscure zines to digital fashion, Shimokitan serves as the central hub for
                    <strong> cataloging, curating, and amplifying </strong> the signals that often get lost in the noise of the mainstream internet.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12 not-prose">
                    <div className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-4">
                        <div className="w-10 h-10 rounded bg-rose-500/10 flex items-center justify-center text-rose-500">
                            01
                        </div>
                        <h3 className="text-white font-black uppercase tracking-wider">Archive</h3>
                        <p className="text-zinc-500 text-sm">Preserving the ephemeral. Every artifact is stored with metadata ensuring its legacy endures beyond the platform.</p>
                    </div>
                    <div className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-4">
                        <div className="w-10 h-10 rounded bg-violet-500/10 flex items-center justify-center text-violet-500">
                            02
                        </div>
                        <h3 className="text-white font-black uppercase tracking-wider">Curate</h3>
                        <p className="text-zinc-500 text-sm">Filtering the signal from the noise. Our curators hand-pick collections that define the current frequency.</p>
                    </div>
                </div>

                <h2>The Mission</h2>
                <p>
                    To build a sanctuary for the weird, the niche, and the beautiful. We believe that algorithms have flattened culture,
                    and it is our duty to reintroduce texture and friction into the digital experience.
                </p>
            </section>
        </div>
    );
}
