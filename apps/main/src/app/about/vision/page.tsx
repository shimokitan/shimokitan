
import React from 'react';
import { Badge } from '@shimokitan/ui';

export default function VisionPage() {
    return (
        <div className="space-y-8">
            <header className="border-b border-zinc-800 pb-8 mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Badge variant="clean" className="text-emerald-500 border-emerald-500/30">Future</Badge>
                </div>
                <h1 className="text-5xl md:text-7xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                    The Vision
                </h1>
                <p className="text-xl text-zinc-400 font-light max-w-2xl">
                    A roadmap to the decentralized future of cultural archiving.
                </p>
            </header>

            <section className="space-y-6">
                <p>
                    Culture should not be gated. The future we envision is one where Shimokitan evolves from a centralized archive into a
                    decentralized protocol for cultural transmission. A network of nodes, each preserving a shard of culture,
                    interconnected through shared meaning and resonance.
                </p>

                <div className="border-l-2 border-emerald-500 pl-6 my-8 prose-quote:not-italic prose-quote:font-mono">
                    "We are not building a platform. We are building a protocol for vibes."
                </div>

                <h3>Phase 1: Foundation (Current)</h3>
                <p>Establish the core database, refine the curation tools, and build a community of archivists. <span className="text-emerald-400 font-mono">STATUS: ONLINE</span></p>

                <h3>Phase 2: Expansion</h3>
                <p>Open the API for external integrations. Allow third-party clients to connect to the Shimokitan database and build custom interfaces.</p>

                <h3>Phase 3: Decentralization</h3>
                <p>Migrate sensitive data to decentralized storage solutions. Implement a governance model where curators are elected by the community based on their contribution resonance.</p>
            </section>
        </div>
    );
}
