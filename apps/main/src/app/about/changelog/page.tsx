
import React from 'react';
import { Badge } from '@shimokitan/ui';

export default function ChangelogPage() {
    const changes = [
        {
            version: '2.0.26',
            date: '2026-02-14',
            title: 'Digital District Update',
            items: [
                'New dashboard layout for Admin console',
                'Refined typography across the platform',
                'Optimized hydration performance on Home screen'
            ]
        },
        {
            version: '2.0.0',
            date: '2026-01-30',
            title: 'Core Reactivation',
            items: [
                'Complete rewrite of the backend infrastructure',
                'Moved to Next.js App Router',
                'Integrated Drizzle ORM and Neon DB'
            ]
        },
        {
            version: '1.5.0',
            date: '2025-12-15',
            title: 'Initial Resonance',
            items: [
                'Beta launch of artifact submission',
                'User authentication system active',
                'Basic search functionality implemented'
            ]
        }
    ];

    return (
        <div className="space-y-8">
            <header className="border-b border-zinc-800 pb-8 mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Badge variant="distortion" className="text-rose-500 border-rose-500/30">Logs</Badge>
                </div>
                <h1 className="text-5xl md:text-7xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                    System Changelog
                </h1>
                <p className="text-xl text-zinc-400 font-light max-w-2xl">
                    Tracking the evolution of the Shimokitan codebase.
                </p>
            </header>

            <section className="space-y-12">
                {changes.map((change) => (
                    <div key={change.version} className="relative pl-8 border-l border-zinc-800 pb-8 last:pb-0 last:border-0">
                        <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700" />

                        <div className="flex items-center gap-4 mb-2">
                            <span className="font-mono text-rose-500 font-bold">{change.version}</span>
                            <span className="text-zinc-600 text-xs uppercase tracking-wider">{change.date}</span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-4 mt-0">{change.title}</h3>

                        <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm marker:text-zinc-600">
                            {change.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        </div>
    );
}
