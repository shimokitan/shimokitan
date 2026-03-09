"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { BentoCard, Badge, cn } from "@shimokitan/ui";
import { useTime } from "../../hooks/use-time";
import Link from "../../components/Link";
import { Dictionary, getEntityUrl } from "@shimokitan/utils";
import { useStationStore } from "../../lib/store/station-store";

type Artifact = {
  id: string;
  title: string;
  category: string;
  thumbnailImage: string | null;
  description: string | null;
  resonance: number | null;
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
  artifactCount,
  entityCount,
  dict,
}: {
  spotlightArtifacts: Artifact[];
  recentZines: (Zine & { artifact: Artifact })[];
  featuredArtifact: Artifact | null;
  entities: any[];
  weatherTemp: string;
  totalResonance: string;
  artifactCount: number;
  entityCount: number;
  dict: Dictionary;
}) {
  const [activeSpotlight, setActiveSpotlight] = useState<number>(0);
  const [activeEntity, setActiveEntity] = useState<number>(0);
  const station = useStationStore();

  const [randomFreq, setRandomFreq] = useState<string>("000");
  const time = useTime();

  useEffect(() => {
    setRandomFreq(Math.floor(Math.random() * 1000).toString(16));
  }, []);

  const heroArtifact = spotlightArtifacts[0];

  /** Derived state: docked audio player is visible when initialized and not minimized */
  const isDockedActive = station.isInitialized && !station.isMinimized;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 md:grid-rows-7 gap-3 h-auto md:h-full">
      {/* 1. Hero / District Branding */}
      <div className="col-span-2 md:col-span-2 md:row-span-3 relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />

        <div className="h-full p-6 md:p-8 flex flex-col items-center justify-center text-center relative">
          <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-zinc-800" />

          <div>
            <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
              <span className="w-8 h-px bg-zinc-800" />
              <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">
                {dict.home.district}
              </span>
              <span className="w-8 h-px bg-zinc-800" />
            </div>

            <h2 className="flex flex-col items-center py-2 text-center">
              <div className="flex flex-col md:flex-row items-center md:gap-3 text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] md:leading-none">
                <span className="text-zinc-800 drop-shadow-sm">SHIMO</span>
                <span className="text-white drop-shadow-md">KITAN</span>
              </div>
              <span className="text-violet-600 text-[11px] font-mono tracking-[0.5em] mt-2 md:mt-4 italic drop-shadow-none">
                DIGITAL_DISTRICT
              </span>
            </h2>

            {/* Tagline */}
            <p className="text-zinc-400 text-xs font-mono mt-4 tracking-wide leading-relaxed mx-auto max-w-[260px]">
              &quot;{dict.home.tagline}&quot;
            </p>
          </div>

          {/* Quick-nav links */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link
                href="/artifacts"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border border-zinc-700 rounded bg-zinc-900/50 text-zinc-300 hover:text-white hover:border-violet-500/60 hover:bg-violet-500/10 transition-all group"
              >
                <Icon icon="lucide:archive" width={11} className="text-violet-500 group-hover:scale-110 transition-transform" />
                {dict.home.nav_archive}
              </Link>
              <Link
                href="/artists"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border border-zinc-700 rounded bg-zinc-900/50 text-zinc-300 hover:text-white hover:border-violet-500/60 hover:bg-violet-500/10 transition-all group"
              >
                <Icon icon="lucide:users" width={11} className="text-violet-500 group-hover:scale-110 transition-transform" />
                {dict.home.nav_entities}
              </Link>
              <Link
                href="/zines"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border border-zinc-700 rounded bg-zinc-900/50 text-zinc-300 hover:text-white hover:border-violet-500/60 hover:bg-violet-500/10 transition-all group"
              >
                <Icon icon="lucide:notebook-pen" width={11} className="text-violet-500 group-hover:scale-110 transition-transform" />
                {dict.home.nav_zines}
              </Link>
            </div>

            {/* Stats strip */}
            <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Icon icon="lucide:database" width={10} className="text-violet-500/70" />
                <span className="text-zinc-400 font-bold">{artifactCount}</span> {dict.home.stats_artifacts}
              </span>
              <span className="w-px h-3 bg-zinc-800" />
              <span className="flex items-center gap-1.5">
                <Icon icon="lucide:user-check" width={10} className="text-violet-500/70" />
                <span className="text-zinc-400 font-bold">{entityCount}</span> {dict.home.stats_entities}
              </span>
              <span className="w-px h-3 bg-zinc-800" />
              <span className="text-zinc-700">{dict.home.stats_version}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Current Signal / Audio Player */}
      <BentoCard
        className="col-span-2 md:col-span-1 md:row-span-3 p-0 overflow-hidden"
        title="Current Signal"
        icon="lucide:radio"
        minimal
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-9 border-b border-zinc-800/50 flex items-center justify-between px-4 bg-zinc-950/40 shrink-0">
            <div className="flex items-center gap-2 text-zinc-500">
              <Icon icon="lucide:disc" width={12} className={isDockedActive ? "animate-spin" : ""} />
              <span className="text-[9px] font-mono tracking-[0.15em] uppercase">LIVE_CENTER</span>
            </div>
            <div className="flex items-center gap-2">
              {station.isInitialized && !station.isMinimized && (
                <button
                  onClick={() => station.setMinimized(true)}
                  className="hidden md:flex items-center justify-center p-1 hover:bg-zinc-800 rounded-md transition-colors text-zinc-500 hover:text-white"
                  title="Minimize to Floating Widget"
                >
                  <Icon icon="lucide:minus" width={12} />
                </button>
              )}
              <div className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                isDockedActive ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-zinc-800"
              )} />
            </div>
          </div>

          {/* Vinyl & Tonearm */}
          <div className="flex-1 flex flex-col items-center justify-center relative p-4 min-h-0">
            <div className="relative group/vinyl">
              <div className={cn(
                "w-32 h-32 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-950 overflow-hidden relative shadow-[0_24px_48px_-12px_rgba(0,0,0,1)] transition-all duration-700",
                isDockedActive ? "animate-[spin_4s_linear_infinite]" : "scale-95 opacity-60 grayscale-[0.3]"
              )}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="absolute rounded-full border border-zinc-900" style={{ inset: `${(i + 1) * 1.5}rem` }} />
                ))}
                <div className="relative w-[42%] h-[42%] rounded-full overflow-hidden border-[3px] border-zinc-950 z-10 shadow-lg">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png"
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-700",
                      !isDockedActive && "opacity-40"
                    )}
                    alt="current signal"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                <div className="absolute w-2 h-2 bg-zinc-400 rounded-full border border-zinc-950 z-20" />
              </div>

              {/* Tonearm */}
              <div
                className={cn(
                  "absolute -right-3 top-0 w-20 h-24 origin-top transition-transform duration-1000 ease-[cubic-bezier(0.45,0.05,0.55,0.95)] z-20 pointer-events-none",
                  isDockedActive ? "rotate-[20deg]" : "rotate-[-12deg]"
                )}
                style={{ transformOrigin: '80% 15%' }}
              >
                <div className="absolute top-0 right-1 w-10 h-10 bg-zinc-900 rounded-full shadow-[3px_3px_0px_rgba(0,0,0,0.5)] flex items-center justify-center border border-zinc-800">
                  <div className="w-7 h-7 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center">
                    <div className="w-5 h-5 bg-zinc-700 rounded-full border border-zinc-900 flex items-center justify-center shadow-inner">
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                    </div>
                  </div>
                  <div className="absolute -top-5 right-0 w-5 h-9 bg-zinc-700 rounded-sm border-x border-b border-zinc-800 shadow-[2px_2px_0_rgba(0,0,0,0.4)] transform rotate-[-15deg]" />
                </div>
                <div className="absolute right-[20px] top-4 w-[5px] h-20 bg-zinc-400 rounded-full origin-top rotate-[5deg] overflow-hidden border-x border-zinc-500">
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-white/40" />
                  <div className="absolute inset-y-0 right-0 w-[1px] bg-black/20" />
                </div>
                <div className="absolute bottom-[-12px] left-[10px] w-6 h-9 flex flex-col items-center transform rotate-[20deg]">
                  <div className="w-4 h-7 bg-zinc-900 rounded-t-sm rounded-br-xl border-l-2 border-zinc-800 relative shadow-[3px_3px_0px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />
                    <div className="absolute top-1 -right-3 w-3 h-1 bg-zinc-800 rounded-full rotate-[-30deg] border-b border-black/40" />
                  </div>
                  <div className="w-2 h-3 bg-rose-600 rounded-b-sm mt-[-2px] ml-1 z-30 border-x border-b border-rose-800 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]" />
                </div>
              </div>
            </div>

            {/* Track Info */}
            <div className="mt-3 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="zinc">LOSSLESS</Badge>
                <span className="text-[8px] font-mono text-zinc-600 uppercase">1411_KBPS</span>
              </div>
              <h3 className={cn(
                "text-sm font-black tracking-tighter uppercase italic leading-none transition-colors",
                isDockedActive ? "text-white" : "text-zinc-700"
              )}>
                {isDockedActive ? "Starboy" : "---"}
              </h3>
              <p className={cn(
                "text-[9px] font-mono font-bold uppercase tracking-widest mt-1",
                isDockedActive ? "text-violet-500" : "text-zinc-800"
              )}>
                {isDockedActive ? "The Weeknd, Daft Punk" : "Enter_Frequency"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="p-3 bg-zinc-900/30 border-t border-zinc-900 space-y-2 shrink-0">
            <div className="w-full flex items-center gap-2 text-[9px] text-zinc-500 font-mono font-black italic">
              <span className="w-7">1:24</span>
              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className={cn("h-full bg-violet-600 transition-all duration-300", isDockedActive ? "w-[35%]" : "w-0")} />
              </div>
              <span className="w-7">3:50</span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button className="text-zinc-600 hover:text-white transition-colors">
                <Icon icon="lucide:skip-back" width={14} />
              </button>
              <button
                onClick={() => {
                  station.toggle();
                  if (station.isMinimized) station.setMinimized(false);
                }}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300",
                  station.isInitialized
                    ? "bg-white text-black shadow-lg"
                    : "bg-zinc-800 text-zinc-600 border border-zinc-700"
                )}
              >
                <Icon icon={station.isInitialized ? "lucide:pause" : "lucide:play"} width={16} className={!station.isInitialized ? "ml-0.5" : ""} />
              </button>
              <button className="text-zinc-600 hover:text-white transition-colors">
                <Icon icon="lucide:skip-forward" width={14} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mx-auto w-24">
              <Icon icon="lucide:volume-2" width={12} className="text-zinc-600" />
              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-500 w-[80%]" />
              </div>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* 3. Featured Card Stack */}
      <BentoCard
        className="col-span-2 md:col-span-1 md:row-span-3 p-0 overflow-hidden md:overflow-visible min-h-[340px] md:min-h-0"
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
                <div className="bg-white p-2 md:p-2.5 rounded-lg shadow-2xl border-2 border-zinc-800 w-32 sm:w-40 md:w-48 text-black">
                  {item.thumbnailImage ? (
                    <img
                      src={item.thumbnailImage}
                      alt={item.title}
                      className="w-full h-28 sm:h-32 md:h-40 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-28 sm:h-32 md:h-40 bg-zinc-200 rounded flex items-center justify-center border border-dashed border-zinc-400">
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

      {/* 4. District / Dynamic Time */}
      <BentoCard
        className="col-span-2 md:col-span-1 md:row-span-3 p-0 overflow-hidden relative"
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

      {/* 5. In The Pit (Featured Item) */}
      {featuredArtifact && (
        <Link
          href={`/artifacts/${featuredArtifact.id}`}
          className="col-span-2 md:col-span-1 md:row-span-2 md:col-start-1 md:row-start-4"
        >
          <BentoCard
            className="h-full"
            title={dict.home.in_the_pit}
            icon="lucide:flame"
          >
            <div className="flex flex-col h-full">
              <div className="relative flex-1 rounded-lg overflow-hidden mb-2 bg-zinc-950">
                {featuredArtifact.thumbnailImage ? (
                  <img
                    src={featuredArtifact.thumbnailImage}
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
              href={getEntityUrl({ type: entity._rawType, slug: entity.slug })}
              className="flex items-center gap-4 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all group shadow-sm"
            >
              <div className="w-12 md:w-14 h-12 md:h-14 shrink-0 relative bg-zinc-950 rounded border border-zinc-700 shadow-inner overflow-hidden flex items-center justify-center text-zinc-600 group-hover:border-violet-500/50 transition-colors">
                {entity.avatar ? (
                  <img
                    src={entity.avatar}
                    className="w-full h-full object-cover grayscale mix-blend-luminosity group-hover:mix-blend-normal group-hover:grayscale-0 transition-all duration-500"
                    alt={entity.name}
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

      {/* 7. Featured Archives - Bento Layout */}
      <BentoCard
        className="col-span-2 md:col-span-1 md:row-span-2 md:col-start-3 md:row-start-4"
        title="Featured Archives"
        icon="lucide:disc"
      >
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[160px] md:h-full">
          {(() => {
            const animeArtifact = spotlightArtifacts.find((a) => a.category === "anime");
            const otherArtifacts = spotlightArtifacts.filter((a) => a.id !== animeArtifact?.id).slice(0, 2);
            return (
              <>
                {/* Primary - tall vertical slot (always anime) */}
                {animeArtifact && (
                  <Link
                    href={`/artifacts/${animeArtifact.id}`}
                    className="relative group rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950 row-span-2"
                  >
                    {animeArtifact.thumbnailImage ? (
                      <img
                        src={animeArtifact.thumbnailImage}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        alt={animeArtifact.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-800">
                        <Icon icon="lucide:music" width={32} />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-zinc-950/80 backdrop-blur-md md:translate-y-full md:group-hover:translate-y-0 transition-transform">
                      <div className="text-[9px] font-black text-white uppercase truncate">
                        {animeArtifact.title}
                      </div>
                      <div className="text-[8px] font-mono text-violet-400 uppercase mt-0.5 tracking-widest">
                        {animeArtifact.category}
                      </div>
                    </div>
                  </Link>
                )}

                {/* Secondary - two horizontal slots stacked */}
                {otherArtifacts.map((artifact) => (
                  <Link
                    key={artifact.id}
                    href={`/artifacts/${artifact.id}`}
                    className="relative group rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950"
                  >
                    {artifact.thumbnailImage ? (
                      <img
                        src={artifact.thumbnailImage}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        alt={artifact.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-800">
                        <Icon icon="lucide:music" width={24} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/80 backdrop-blur-md md:translate-y-full md:group-hover:translate-y-0 transition-transform">
                      <div className="text-[8px] font-black text-white uppercase truncate px-0.5">
                        {artifact.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            );
          })()}
        </div>
      </BentoCard>

      {/* 8. Video */}
      <BentoCard
        className="col-span-2 md:col-span-2 md:row-span-4 md:col-start-4 md:row-start-4 overflow-hidden p-0 bg-black min-h-[280px] md:min-h-0"
        minimal
      >
        <div className="w-full h-full aspect-video md:aspect-auto">
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
        </div>
      </BentoCard>

      {/* 9. Narrative Collapse / Zine Feed */}
      <BentoCard
        className="col-span-2 md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-6 overflow-hidden p-0"
        title="Narrative Collapse"
        icon="lucide:notebook-pen"
        minimal
      >
        <div className="flex flex-col h-full bg-zinc-950/20 backdrop-blur-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-2">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:activity" className="text-violet-500 animate-pulse" width={14} />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-black">
                Live_Feed // Resonance_Events
              </span>
            </div>
            <div className="text-[10px] font-mono text-zinc-600 uppercase flex items-center gap-2">
              <span className="w-1 h-3 bg-zinc-800" />
              Pulse_Registry
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {recentZines.length > 0 ? (
              recentZines.slice(0, 3).map((zine) => (
                <div
                  key={zine.id}
                  className="flex gap-4 p-3 border border-zinc-900 bg-zinc-950/50 rounded-lg group hover:border-violet-500/50 transition-all hover:bg-zinc-900/50"
                >
                  {/* Linked Artifact Thumbnail */}
                  <div className="shrink-0 w-12 h-12 rounded overflow-hidden border border-zinc-800 bg-zinc-900 shadow-inner group-hover:border-violet-500/30 transition-colors">
                    <Link href={`/artifacts/${zine.artifact.id}`} className="block w-full h-full">
                      {zine.artifact.thumbnailImage ? (
                        <img
                          src={zine.artifact.thumbnailImage}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110"
                          alt={zine.artifact.title}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                          <Icon icon="lucide:disc" width={20} />
                        </div>
                      )}
                    </Link>
                  </div>
                  {/* Zine Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] font-mono text-violet-500 font-black uppercase tracking-widest truncate">
                          @{zine.author}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600 truncate opacity-60">
                          // {zine.artifact.title}
                        </span>
                      </div>
                      {(zine.resonance || 0) > 0 && (
                        <div className="flex items-center gap-1 text-[9px] font-mono text-rose-500/70 shrink-0">
                          <Icon icon="lucide:zap" width={8} />
                          <span>{zine.resonance}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed line-clamp-2 italic opacity-85 group-hover:opacity-100 transition-opacity">
                      &quot;{zine.content}&quot;
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-800 border border-dashed border-zinc-900 rounded-xl py-8">
                <Icon icon="lucide:inbox" width={32} className="opacity-20 mb-2" />
                <span className="text-[10px] font-mono uppercase tracking-[0.5em] opacity-40">No_Active_Pulse</span>
              </div>
            )}
          </div>
        </div>
      </BentoCard>
    </div>
  );
}
