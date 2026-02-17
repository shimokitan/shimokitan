import React from 'react';
import { Icon } from '@iconify/react';
import { BentoCard, Badge, cn } from '@shimokitan/ui';
import { MainLayout } from '@/components/layout/MainLayout';
import { getEntityById } from '@shimokitan/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const MOCK_ENTITIES_DATA: Record<string, any> = {
    "yoasobi-signal": {
        id: "yoasobi-signal",
        type: "individual",
        avatarUrl: "https://images.unsplash.com/photo-1514525253361-9f7a83707e4d?w=400&q=80",
        isMajor: true,
        isVerified: true,
        allowMirroring: true,
        translations: [{ locale: "en", name: "YOASOBI", bio: "A 'novel-into-music' unit composed of composer Ayase and vocalist ikura. Documenting the intersection of fiction and resonance in the digital district." }],
        socialLinks: [{ platform: "Twitter", url: "https://twitter.com/yoasobi_staff" }, { platform: "YouTube", url: "https://youtube.com/yoasobi" }],
        credits: [
            { role: "Composer", artifact: { id: "racing-night", title: "Racing into the Night", category: "music", coverImage: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80", score: 98, status: "the_pit" } },
            { role: "Vocal", artifact: { id: "idol-shard", title: "IDOL // OSHI NO KO", category: "music", coverImage: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80", score: 94, status: "the_pit" } }
        ]
    },
    "lamp-signal": {
        id: "lamp-signal",
        type: "circle",
        avatarUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&q=80",
        isMajor: false,
        isVerified: true,
        allowMirroring: true,
        translations: [{ locale: "en", name: "Lamp", bio: "Formed in 2000. ARCHIVE_NOTE: Their sound is a complex layering of bossa nova, 60s pop, and the humidity of a Tokyo summer evening." }],
        socialLinks: [{ platform: "Instagram", url: "#" }],
        credits: [
            { role: "Ensemble", artifact: { id: "lamp-shore", title: "GHOST ON THE SHORE", category: "music", coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80", score: 92, status: "back_alley" } }
        ]
    },
    "ado-signal": {
        id: "ado-signal",
        type: "individual",
        avatarUrl: "https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=400&q=80",
        isMajor: true,
        isVerified: true,
        allowMirroring: false,
        translations: [{ locale: "en", name: "ADO", bio: "The silhouette of a new era. A vocal powerhouse mirroring the frustration and energy of the underground through a major-circuit lens." }],
        socialLinks: [{ platform: "YouTube", url: "#" }],
        credits: [
            { role: "Vocal", artifact: { id: "usseewa-shard", title: "USSEEWA", category: "music", coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80", score: 99, status: "the_pit" } }
        ]
    }
};

export default async function ArtistPage(props: { params: Promise<{ locale: string, id: string }> }) {
    const { locale, id } = await props.params;

    let entity: any = null;

    // 1. Check Mock Data First
    if (MOCK_ENTITIES_DATA[id]) {
        entity = MOCK_ENTITIES_DATA[id];
    } else {
        // 2. Try Database with Safety
        try {
            entity = await getEntityById(id);
        } catch (error) {
            console.error(`SCANNER_ERROR: Failed to retrieve data for entity ${id}. Using ghost-link fallback.`);
        }
    }

    if (!entity) {
        notFound();
    }

    const translations = entity.translations || [];
    const translation = translations.find((t: any) => t.locale === locale) || translations[0];
    const name = translation?.name || "Anonymous Artist";
    const bio = translation?.bio || "";

    // Group artifacts by role
    const credits = entity.credits || [];

    return (
        <MainLayout>
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">

                {/* 1. Profile Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-950 border-y border-zinc-800 p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/[0.01] -skew-x-12 translate-x-1/2 pointer-events-none" />

                    <div className="flex items-center gap-6 z-10">
                        <div className="relative">
                            <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 p-1 transform -rotate-3 overflow-hidden">
                                <img
                                    src={entity.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${entity.id}`}
                                    alt={name}
                                    className="w-full h-full object-cover grayscale"
                                />
                                <div className="absolute inset-0 bg-violet-500/10 mix-blend-overlay" />
                            </div>
                            {entity.isVerified && (
                                <div className="absolute -top-2 -right-2 bg-emerald-500 text-black p-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                    <Icon icon="lucide:check-circle" width={12} height={12} />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <span className="bg-zinc-800 text-zinc-500 px-2 py-0.5 text-[8px] font-mono uppercase tracking-[0.2em]">{entity.type}</span>
                                <span className="text-zinc-600 font-mono text-[8px]">UID_{entity.id}</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">{name}</h1>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6 md:mt-0 z-10">
                        {Array.isArray(entity.socialLinks) && entity.socialLinks.map((link: any, i: number) => (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-violet-400 hover:border-violet-500/50 transition-all group"
                            >
                                <Icon icon={`simple-icons:${link.platform?.toLowerCase() || 'link'}`} width={18} height={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* 2. Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Bio & Details */}
                    <div className="md:col-span-4 space-y-6">
                        <BentoCard title=" Dossier" icon="lucide:file-text">
                            <div className="space-y-4">
                                <p className="text-sm text-zinc-400 leading-relaxed font-serif italic">
                                    &ldquo;{bio || "Metadata corrupted or purged. No dossier available."}&rdquo;
                                </p>
                                <div className="pt-4 border-t border-zinc-900 grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-zinc-600 uppercase font-mono tracking-widest">Class</span>
                                        <span className="text-xs font-bold text-zinc-400 capitalize">{entity.isMajor ? 'Major Circuit' : 'Underground'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-zinc-600 uppercase font-mono tracking-widest">Mirroring</span>
                                        <span className="text-xs font-bold text-zinc-400">{entity.allowMirroring ? 'ENABLED' : 'RESTRICTED'}</span>
                                    </div>
                                </div>
                            </div>
                        </BentoCard>

                        <BentoCard title="Network Connectivity" icon="lucide:share-2" minimal>
                            <div className="p-4 grid grid-cols-1 gap-2">
                                {Array.isArray(entity.socialLinks) && entity.socialLinks.length > 0 ? (
                                    entity.socialLinks.map((link: any, i: number) => (
                                        <a key={i} href={link.url} className="flex items-center justify-between p-2 bg-zinc-900/50 border border-zinc-800 rounded text-[10px] font-mono text-zinc-400 hover:bg-violet-600/10 hover:border-violet-500/30 transition-all uppercase">
                                            <span>{link.platform}</span>
                                            <Icon icon="lucide:external-link" width={10} />
                                        </a>
                                    ))
                                ) : (
                                    <span className="text-[10px] text-zinc-700 uppercase font-mono">No active uplinks found.</span>
                                )}
                            </div>
                        </BentoCard>
                    </div>

                    {/* Shared Shards (Artifacts) */}
                    <div className="md:col-span-8 space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-1 h-6 bg-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
                            <h2 className="text-xl font-black tracking-tighter uppercase italic">Resonating Shards</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {credits.length > 0 ? (
                                credits.map((credit: any, i: number) => {
                                    const artifact = credit.artifact;
                                    const artTranslation = artifact.translations?.find((t: any) => t.locale === locale) || artifact.translations?.[0];

                                    return (
                                        <Link key={i} href={`/artifacts/${artifact.id}`} className="group relative block bg-zinc-950 border border-zinc-900 hover:border-violet-500/30 transition-all duration-500 overflow-hidden">
                                            <div className="aspect-[21/9] relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                                <img
                                                    src={artifact.coverImage || '/placeholder.png'}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                                                <div className="absolute bottom-2 left-3 right-3">
                                                    <div className="text-[8px] text-violet-500 font-black uppercase tracking-widest mb-1">{credit.role}</div>
                                                    <h3 className="text-sm font-black text-white uppercase italic tracking-tighter leading-none truncate">
                                                        {artTranslation?.title || "Untitled Shard"}
                                                    </h3>
                                                </div>
                                            </div>
                                            {/* Micro HUD */}
                                            <div className="flex justify-between items-center px-3 py-1.5 text-[8px] font-mono text-zinc-600 uppercase">
                                                <span>{artifact.category}</span>
                                                <div className="flex items-center gap-1">
                                                    <Icon icon="lucide:flame" className="text-rose-500" />
                                                    <span className="text-zinc-400 font-bold">{artifact.score}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="col-span-2 py-12 flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-xl">
                                    <Icon icon="lucide:ghost" className="text-zinc-800 mb-2" width={24} />
                                    <span className="text-[10px] text-zinc-700 uppercase font-mono">No shard contributions detected.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
