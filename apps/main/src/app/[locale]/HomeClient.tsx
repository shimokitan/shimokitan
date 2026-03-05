"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { BentoCard, Badge } from "@shimokitan/ui";
import { useTime } from "../../hooks/use-time";
import Link from "../../components/Link";
import { Dictionary } from "@shimokitan/utils";

type Artifact = {
  id: string;
  title: string;
  category: string;
  coverImage: string | null;
  description: string | null;
  score: number | null;
  status: string | null;
  specs: any;
  videoUrl?: string | null;
};

type Zine = {
  id: string;
  artifactId: string;
  author: string;
  content: string;
  resonance: number | null;
};

export default function HomeClient({
  spotlightArtifacts,
  recentZines,
  featuredArtifact,
  entities,
  weatherTemp,
  totalResonance,
  dict,
}: {
  spotlightArtifacts: Artifact[];
  recentZines: (Zine & { artifact: Artifact })[];
  featuredArtifact: Artifact | null;
  entities: any[];
  weatherTemp: string;
  totalResonance: string;
  dict: Dictionary;
}) {
  const [activeSpotlight, setActiveSpotlight] = useState<number>(0);
  const [activeEntity, setActiveEntity] = useState<number>(0);

  const [randomFreq, setRandomFreq] = useState<string>("000");
  const time = useTime();

  useEffect(() => {
    setRandomFreq(Math.floor(Math.random() * 1000).toString(16));
  }, []);

  const heroArtifact = spotlightArtifacts[0];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 md:grid-rows-7 gap-3 h-auto md:h-full">
      {/* 1. Hero / Asymmetrical Editorial Dossier */}
      <div className="col-span-2 md:col-span-3 md:row-span-3 relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col md:flex-row">
        {/* Left Side: Visual Archive */}
        <div className="w-full md:w-2/3 relative h-64 md:h-auto overflow-hidden border-r border-zinc-900 bg-zinc-900">
          {heroArtifact?.coverImage ? (
            <img
              src={heroArtifact.coverImage}
              alt="Magazine Cover"
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-50 group-hover:opacity-70"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-800">
              <Icon icon="lucide:image-off" width={48} className="opacity-50" />
              <span className="text-[11px] font-mono mt-2 tracking-widest">
                NO_VISUAL_DATA
              </span>
            </div>
          )}
          {/* Flat Legibility Overlays (No Gradients) */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-zinc-950/80 backdrop-blur-sm p-6 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-3 bg-violet-600" />
              <span className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase">
                Visual_Resource // {heroArtifact?.id || "VOID"}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black italic text-white uppercase tracking-tighter truncate">
              {heroArtifact?.title || "Untitled Transmission"}
            </h3>
          </div>

          {/* Technical HUD Overlays */}
          <div className="absolute top-4 left-4 flex flex-col gap-1 border-l border-violet-500/50 pl-2">
            <span className="text-[9px] font-mono text-violet-500 leading-none">
              REG_TYPE // PRIMARY
            </span>
            <span className="text-[9px] font-mono text-zinc-600 leading-none">
              SECTOR // 03
            </span>
          </div>
        </div>

        {/* Right Side: District Navigation */}
        <div className="flex-1 bg-zinc-950 p-6 md:p-8 flex flex-col justify-between relative">
          <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-zinc-800" />

          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-zinc-800" />
              <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">
                {dict.home.district}
              </span>
            </div>

            <h2 className="flex flex-col text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter uppercase italic leading-[0.85]">
              <span className="text-zinc-800">SHIMO</span>
              <span className="text-white">KITAN</span>
              <span className="text-violet-600 text-[11px] font-mono tracking-[0.5em] mt-2 italic">
                DIGITAL_DISTRICT
              </span>
            </h2>
          </div>

          <div className="mt-8 md:mt-0">
            <p className="text-zinc-500 text-[11px] font-mono leading-relaxed uppercase tracking-wider mb-6 line-clamp-4">
              {dict.home.description}
            </p>

            <Link
              href={`/artifacts/${heroArtifact?.id}`}
              className="inline-flex items-center justify-between w-full bg-zinc-900 border border-zinc-800 text-white p-4 hover:bg-violet-600 hover:border-violet-500 transition-all group"
            >
              <span className="text-xs font-black tracking-[0.2em]">
                {dict.home.initialize}
              </span>
              <Icon
                icon="lucide:arrow-right"
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Featured Card Stack */}
      <BentoCard
        className="col-span-2 md:col-span-1 md:row-span-3 overflow-visible min-h-[340px] md:min-h-0"
        title={dict.home.recent_shards}
        icon="lucide:star"
      >
        <div className="flex flex-col items-center justify-center h-full relative">
          <div className="relative w-full h-64 flex items-center justify-center">
            {spotlightArtifacts.map((item, i) => (
              <div
                key={item.id}
                onClick={() => setActiveSpotlight(i)}
                className={`absolute cursor-pointer transition-all duration-500 hover:z-40 ${activeSpotlight === i ? "z-30 scale-110 shadow-2xl" : "z-10 opacity-80"}`}
                style={{
                  transform:
                    activeSpotlight === i
                      ? "rotate(0deg) translateX(0) translateY(0)"
                      : `rotate(${i === 0 ? -12 : i === 1 ? 5 : -6}deg) translateX(${(i - 1) * 20}px) translateY(${i * 10}px)`,
                }}
              >
                <div className="bg-white p-1.5 md:p-2 rounded-lg shadow-2xl border-2 border-zinc-800 w-28 sm:w-32 md:w-40 text-black">
                  {item.coverImage ? (
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-24 md:h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-24 md:h-32 bg-zinc-200 rounded flex items-center justify-center border border-dashed border-zinc-400">
                      <Icon
                        icon="lucide:image-off"
                        width={24}
                        className="text-zinc-400"
                      />
                    </div>
                  )}
                  <div className="mt-1.5 text-[11px] font-bold truncate">
                    {item.title}
                  </div>
                  <Badge variant="distortion" className="text-[10px] mt-1">
                    {item.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BentoCard>

      {/* 3. District / Dynamic Time */}
      <BentoCard
        className="col-span-1 md:col-span-1 md:row-span-3 p-0 overflow-hidden relative"
        minimal
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="flex flex-col h-full relative z-10 bg-gradient-to-b from-transparent to-zinc-950/90">
          {/* Header: Signal Status */}
          <div className="flex items-center justify-between h-8 px-4 bg-zinc-950/50 border-b border-zinc-800/50 z-10 group">
            <div className="flex items-center gap-2 text-zinc-500 group-hover:text-violet-400 transition-colors">
              <Icon icon="lucide:map-pin" width={10} height={10} />
              <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-black">
                {dict.home.district}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider">
                {dict.home.signal_stable}
              </span>
            </div>
          </div>

          {/* Main: Clock & Phase */}
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="text-4xl md:text-5xl font-black tracking-tighter text-white font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-2">
              {time || "00:00"}
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-violet-600/10 text-violet-400 border border-violet-500/30 rounded">
              <Icon icon="lucide:clock" width={10} />
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold">
                {parseInt(time?.split(":")[0] || "12") < 5
                  ? "GHOST_HOUR // PHASE_04"
                  : parseInt(time?.split(":")[0] || "12") < 12
                    ? "MORNING_FLUX // PHASE_01"
                    : parseInt(time?.split(":")[0] || "12") < 18
                      ? "NEON_DUSK // PHASE_02"
                      : "VOID_NIGHT // PHASE_03"}
              </span>
            </div>
            <div className="mt-3 text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] font-black opacity-60">
              Tokyo, Shimokitazawa, JST
            </div>
          </div>

          {/* Scanner Activity Feed */}
          <div className="mt-auto p-4 space-y-3 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-900 border-dashed">
            <div className="flex flex-col gap-2 font-mono text-[11px] text-zinc-400 uppercase">
              <div className="flex justify-between items-center group">
                <span className="group-hover:text-white transition-colors">
                  [{dict.home.scanning_freq}]
                </span>
                <span className="text-zinc-500">0x{randomFreq}</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-zinc-300">SHIMO_VALVE_82</span>
                <span className="text-violet-500 flex items-center gap-1.5 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                  <div className="w-1 h-1 rounded-full bg-violet-500 animate-ping" />
                  {dict.home.active}
                </span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="group-hover:text-white transition-colors">
                  [{dict.home.data_resonance}]
                </span>
                <span className="text-emerald-500">74.2%</span>
              </div>
            </div>

            {/* Weather/Stats Row */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-900/80">
              <div className="flex items-center justify-center gap-2 bg-zinc-900/50 py-2.5 rounded border border-zinc-800 hover:border-rose-500/50 hover:bg-zinc-800/80 transition-colors group">
                <Icon
                  icon="lucide:thermometer"
                  width={14}
                  className="text-rose-500 group-hover:scale-110 group-hover:-rotate-6 transition-transform"
                />
                <span className="text-[11px] font-bold text-white tracking-wider font-mono">
                  {weatherTemp}
                </span>
              </div>
              <div
                className="flex items-center justify-center gap-2 bg-zinc-900/50 py-2.5 rounded border border-zinc-800 hover:border-violet-500/50 hover:bg-zinc-800/80 transition-colors group"
                title="Active Core Records"
              >
                <Icon
                  icon="lucide:database"
                  width={14}
                  className="text-violet-500 group-hover:scale-110 group-hover:rotate-6 transition-transform"
                />
                <span className="text-[11px] font-bold text-white tracking-wider font-mono">
                  {totalResonance}
                </span>
              </div>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* 4. Featured Artifacts Grid */}
      <BentoCard
        className="col-span-2 md:col-span-1 md:row-span-2 md:col-start-3 md:row-start-4"
        title="Featured Archives"
        icon="lucide:disc"
      >
        <div className="grid grid-cols-2 gap-2 h-full">
          {spotlightArtifacts.slice(0, 4).map((artifact) => (
            <Link
              key={artifact.id}
              href={`/artifacts/${artifact.id}`}
              className="relative group rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950"
            >
              {artifact.coverImage ? (
                <img
                  src={artifact.coverImage}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-800">
                  <Icon icon="lucide:music" width={32} />
                </div>
              )}
              <div className="absolute inset-0 bg-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/80 backdrop-blur-md transform translate-y-full group-hover:translate-y-0 transition-transform">
                <div className="text-[9px] font-black text-white uppercase text-center truncate px-1">
                  {artifact.title}
                </div>
                <div className="text-[8px] font-mono text-violet-400 uppercase text-center mt-0.5 tracking-widest">
                  {artifact.category}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </BentoCard>

      {/* 5. In The Pit (Featured Item) */}
      {featuredArtifact && (
        <Link
          href={`/artifacts/${featuredArtifact.id}`}
          className="col-span-1 md:col-span-1 md:row-span-2 md:col-start-1 md:row-start-4"
        >
          <BentoCard
            className="h-full"
            title={dict.home.in_the_pit}
            icon="lucide:flame"
          >
            <div className="flex flex-col h-full">
              <div className="relative flex-1 rounded-lg overflow-hidden mb-2 bg-zinc-950">
                {featuredArtifact.coverImage ? (
                  <img
                    src={featuredArtifact.coverImage}
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-800">
                    <Icon icon="lucide:image-off" width={32} />
                    <span className="text-[10px] font-mono mt-1 tracking-widest">
                      NO_VISUAL_DATA
                    </span>
                  </div>
                )}
                {/* Solid Flat Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-zinc-950/60 flex flex-col justify-end p-2">
                  <div className="text-[9px] font-mono text-rose-500 uppercase tracking-tighter">
                    High_Resonance // 0.96
                  </div>
                </div>
              </div>
              <h3 className="text-xs font-bold uppercase truncate">
                {featuredArtifact.title}
              </h3>
              <p className="text-[11px] text-zinc-500 line-clamp-1">
                {featuredArtifact.description}
              </p>
            </div>
          </BentoCard>
        </Link>
      )}

      {/* 6. District Residents List */}
      <BentoCard
        className="col-span-2 md:col-span-1 md:row-span-2 md:col-start-2 md:row-start-4"
        title={dict.home.district_entities}
        icon="lucide:user-check"
      >
        <div className="flex flex-col gap-3 h-full">
          {entities.slice(0, 2).map((entity) => (
            <Link
              key={entity.id}
              href={`/artists/${entity.id}`}
              className="flex items-center gap-4 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all group shadow-sm"
            >
              <div className="w-12 md:w-14 h-12 md:h-14 shrink-0 relative bg-zinc-950 rounded border border-zinc-700 shadow-inner overflow-hidden flex items-center justify-center text-zinc-600 group-hover:border-violet-500/50 transition-colors">
                {entity.avatar ? (
                  <img
                    src={entity.avatar}
                    className="w-full h-full object-cover grayscale mix-blend-luminosity group-hover:mix-blend-normal group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <Icon icon="lucide:user" width={24} />
                )}
                <div className="absolute top-0 right-0 bg-emerald-500 w-2.5 h-2.5 rounded-bl border-b border-l border-zinc-800 z-10 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-white uppercase italic tracking-tight group-hover:text-violet-400 truncate mb-1">
                  {entity.name}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="lucide:fingerprint"
                      width={10}
                      className="text-zinc-500"
                    />
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest truncate">
                      {entity.uid}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="lucide:tag"
                      width={10}
                      className="text-violet-500/70"
                    />
                    <span className="text-[11px] font-mono text-violet-400 font-bold uppercase truncate">
                      {entity.type.split("_").join(" ")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          <Link
            href="/artists"
            className="mt-auto border border-dashed border-zinc-800 rounded bg-zinc-950/30 text-zinc-500 hover:text-white hover:border-zinc-500 hover:bg-zinc-900 transition-colors py-2 px-3 flex justify-between items-center gap-2 text-[11px] font-mono uppercase tracking-widest group"
          >
            <span>View Registry</span>
            <Icon
              icon="lucide:arrow-right"
              width={12}
              className="group-hover:translate-x-1 group-hover:text-white transition-transform"
            />
          </Link>
        </div>
      </BentoCard>

      {/* 8. Video */}
      <BentoCard
        className="col-span-2 md:col-span-2 md:row-span-4 md:col-start-4 md:row-start-4 overflow-hidden p-0 bg-black"
        minimal
      >
        {featuredArtifact?.videoUrl ? (
          <iframe
            src={featuredArtifact.videoUrl}
            className="w-full h-full border-0 pointer-events-auto"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-800 bg-zinc-950">
            <Icon icon="lucide:video-off" width={48} className="opacity-50" />
            <span className="text-[12px] font-mono mt-2 tracking-widest">
              NO_VIDEO_SIGNAL
            </span>
          </div>
        )}
      </BentoCard>

      {/* 9. Editorial */}
      <BentoCard
        className="col-span-2 md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-6 overflow-hidden p-0"
        minimal
      >
        <div className="flex h-full w-full">
          <div className="w-1/2 relative hidden md:block bg-zinc-900">
            {heroArtifact?.coverImage && (
              <img
                src={heroArtifact.coverImage}
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-opacity"
              />
            )}
            {/* Shard Overlay - Sharp Split */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-zinc-950" />
          </div>
          <div className="flex-1 p-6 flex flex-col justify-center bg-zinc-950/50 backdrop-blur-sm">
            <Badge variant="gold" className="mb-2">
              {dict.home.editorial_sigil}
            </Badge>
            <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">
              {dict.home.featured_title}
            </h3>
            <p className="text-zinc-500 text-xs italic leading-relaxed line-clamp-2">
              {dict.home.featured_description}
            </p>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}
