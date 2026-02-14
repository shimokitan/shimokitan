"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { BentoCard, Badge } from '@shimokitan/ui';
import { useTime } from '../hooks/use-time';
import { MainLayout } from '../components/layout/MainLayout';
import Link from 'next/link';

// --- Assets ---

const spotlightItems = [
  { title: "Cyberpunk: Edgerunners", img: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&q=80", tag: "DISTORTION" },
  { title: "Chainsaw Man", img: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=600&q=80", tag: "TRUTH" },
  { title: "Mob Psycho 100", img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80", tag: "GOLD" },
];

const echoes = [
  { title: "Steins;Gate", user: "OkabeFann", tag: "GOLD", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80" },
  { title: "K-On!", user: "Yui_Tea", tag: "CLEAN", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },
  { title: "Akiba Maid War", user: "Ranko", tag: "DISTORTION", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80" },
  { title: "Nier: Automata", user: "2B_OrNot", tag: "TRUTH", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80" },
  { title: "FLCL", user: "Atomsk", tag: "DISTORTION", img: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400&q=80" },
  { title: "Serial Lain", user: "Wired", tag: "TRUTH", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80" },
];

const albumCovers = [
  { title: "Neon Genesis", artist: "Cruel Angel", img: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&q=80" },
  { title: "Cowboy Bebop", artist: "Tank!", img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80" },
  { title: "FLCL OST", artist: "The Pillows", img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&q=80" },
  { title: "Samurai Champloo", artist: "Nujabes", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80" },
];

export default function AppPage() {
  const [activeSpotlight, setActiveSpotlight] = useState<number>(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const time = useTime();

  return (
    <MainLayout>
      <div className="grid grid-cols-2 md:grid-cols-5 md:grid-rows-7 gap-3 h-auto md:h-full">
        {/* 1. Hero / Magazine Cover */}
        <div className="col-span-2 md:col-span-3 md:row-span-3 relative group rounded-xl overflow-hidden border border-zinc-800/80 hover:border-violet-500/50 transition-all min-h-[45vh] md:min-h-0 bg-zinc-950 shadow-2xl">
          {/* Technical Markings */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 pointer-events-none">
            <div className="flex gap-1">
              <div className="w-2 h-0.5 bg-violet-500" />
              <div className="w-8 h-0.5 bg-zinc-800" />
            </div>
            <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-[0.2em]">Data // Visual_Link_02</span>
          </div>

          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1200&q=80"
            alt="Magazine Cover"
            className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] opacity-60 mix-blend-lighten"
          />

          {/* Scanning Line Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent h-20 w-full animate-[float_10s_linear_infinite] pointer-events-none" />

          {/* Multiple Gradient Layers */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950/60 via-transparent to-rose-950/20"></div>

          {/* Floating Badge Top Right */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <Badge variant="distortion">ISSUE_012</Badge>
            <Badge variant="truth">RES_HIGH_W26</Badge>
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-8 z-10">
            <div className="w-12 h-1 bg-violet-600 mb-6" />
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] text-white mb-4 hover-glitch italic">
              VOID<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400">STATE.</span>
            </h2>

            <p className="text-zinc-300 text-xs font-mono leading-relaxed max-w-xs mb-8 uppercase tracking-wide">
              Archive the friction. <span className="text-violet-400 opacity-60">{"//"}</span> Reject the sterile. <span className="text-violet-400 opacity-60">{"//"}</span> Embrace the noise of the street.
            </p>

            <div className="flex gap-3">
              <button className="bg-violet-600 text-white px-6 py-2 rounded-sm text-xs font-black tracking-widest hover:bg-violet-500 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] group">
                INITIALIZE <Icon icon="lucide:zap" width={12} height={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border border-zinc-700 bg-zinc-900/40 text-zinc-300 px-6 py-2 rounded-sm text-xs font-black tracking-widest hover:border-zinc-400 hover:text-white transition-all backdrop-blur-md">
                METADATA
              </button>
            </div>
          </div>

          {/* Digital Corner Accent */}
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-violet-500/30 pointer-events-none" />
        </div>

        {/* 2. Featured Spotlight */}
        <BentoCard className="col-span-2 md:col-span-1 md:row-span-3 overflow-visible min-h-[340px] md:min-h-0" title="Featured Zines" icon="lucide:star">
          <div className="flex flex-col items-center justify-center h-full relative">
            <div className="relative w-full h-64 flex items-center justify-center">
              {spotlightItems.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setActiveSpotlight(i)}
                  className={`absolute cursor-pointer transition-all duration-500 hover:z-40 ${activeSpotlight === i ? 'z-30 scale-110 shadow-2xl' : 'z-10 hover:z-20 opacity-80 hover:opacity-100'
                    } ${i !== activeSpotlight && 'hover:rotate-0'}`}
                  style={{
                    transform: activeSpotlight === i
                      ? 'rotate(0deg) translateX(0) translateY(0)'
                      : `rotate(${i === 0 ? -12 : i === 1 ? 5 : -6}deg) translateX(${(i - 1) * 16}px) translateY(${i * 5}px)`,
                  }}
                >
                  <div className="bg-white p-2 rounded-lg shadow-2xl border-2 border-zinc-800 w-36 md:w-44 hover-glitch text-black font-sans">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-28 md:h-36 object-cover rounded shadow-inner"
                    />
                    <div className="mt-2 px-1 pb-1">
                      <div className="text-xs font-bold line-clamp-1 mb-1">{item.title}</div>
                      <Badge variant={item.tag.toLowerCase() as "distortion" | "truth" | "gold"}>{item.tag}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto text-center pb-2">
              <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 justify-center">
                <span className="w-1 h-1 rounded-full bg-violet-500"></span>
                {activeSpotlight + 1} / {spotlightItems.length}
              </p>
            </div>
          </div>
        </BentoCard>

        {/* 3. In The Pit */}
        <Link href="/artifacts/bocchi-the-rock" className="col-span-1 md:col-span-1 md:row-span-3">
          <BentoCard className="h-full min-h-[25vh] md:min-h-0" title="In The Pit" icon="lucide:flame" action={<Icon icon="lucide:more-horizontal" width={14} height={14} />}>
            <div className="flex flex-col h-full -m-1">
              <div className="relative flex-1 rounded-lg overflow-hidden mb-2 border border-zinc-800/50 group-hover:border-violet-500/50 transition-all hover-glitch min-h-0">
                <img
                  src="https://images.unsplash.com/photo-1548502669-522718227b26?q=80&w=600&auto=format&fit=crop"
                  alt="Now Playing"
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-1.5 left-1.5 bg-black/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-white font-mono border border-zinc-700/50">
                  EP 08 • LIVE
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center backdrop-blur-sm">
                    <Icon icon="lucide:play" width={20} height={20} className="text-black ml-0.5" />
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold leading-tight mb-1">Bocchi the Rock!</h3>
              <p className="text-[11px] text-zinc-400 italic line-clamp-2 mb-2">&quot;Fuzz-drenched anthem for bedroom guitarists.&quot;</p>

              <div className="mt-auto flex items-center gap-1">
                <Badge variant="truth">TRUTH</Badge>
                <Badge variant="distortion">NOISE</Badge>
              </div>
            </div>
          </BentoCard>
        </Link>

        {/* 4. Recent Echoes */}
        <BentoCard className="col-span-1 md:col-span-1 md:row-span-2 md:col-start-3 md:row-start-4 min-h-[25vh] md:min-h-0" title="Recent Echoes" icon="lucide:ghost" action={<div className="text-[10px] underline cursor-pointer">All</div>}>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-1.5 h-full -m-1">
            {echoes.slice(0, 4).map((echo, i) => (
              <div key={i} className="relative group cursor-pointer rounded-lg overflow-hidden border border-zinc-800/50 hover:border-violet-500/50 transition-all hover-glitch aspect-square md:aspect-auto">
                <img
                  src={echo.img}
                  alt={echo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-1.5">
                  <span className="text-[10px] font-bold text-white line-clamp-1 hidden md:block">{echo.title}</span>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* 5. Soundtrack & 6. District */}
        <div className="col-span-2 md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-4 flex flex-col md:flex-row gap-2.5">
          <Link href="/artifacts/neon-genesis-ost" className="flex-1">
            <BentoCard className="h-36 md:h-full" title="Soundtrack" icon="lucide:disc">
              <div className="flex flex-row items-center h-full gap-4 -m-1">
                <div className="relative aspect-square h-24 md:h-full rounded-lg overflow-hidden border border-zinc-800/50 group-hover:border-violet-500/50 transition-all shrink-0 shadow-lg">
                  <img
                    src={albumCovers[0].img}
                    alt={albumCovers[0].title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>

                <div className="flex flex-col flex-1 py-1 pr-1 min-w-0 h-full md:justify-center">
                  <div className="px-0.5 md:mb-1">
                    <h4 className="text-base font-black text-white leading-tight truncate uppercase tracking-tighter">{albumCovers[0].title}</h4>
                    <p className="text-xs text-zinc-400 font-mono truncate uppercase mt-0.5 tracking-wide">{albumCovers[0].artist}</p>
                  </div>

                  <div className="flex items-center gap-2 px-0.5 mt-auto mb-2 md:mt-1.5 md:mb-1.5">
                    <span className="text-[10px] text-zinc-500 font-mono shrink-0">1:24</span>
                    <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full w-2/5 transition-all"></div>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono shrink-0">3:47</span>
                  </div>

                  <div className="flex items-center justify-between md:justify-center gap-5 md:mt-1 pb-1">
                    <button className="text-zinc-500 hover:text-white transition-colors">
                      <Icon icon="lucide:skip-back" width={14} height={14} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                      <Icon icon={isAudioPlaying ? "lucide:pause" : "lucide:play"} width={16} height={16} className="text-black ml-0.5" />
                    </div>
                    <button className="text-zinc-500 hover:text-white transition-colors">
                      <Icon icon="lucide:skip-forward" width={14} height={14} />
                    </button>
                  </div>
                </div>
              </div>
            </BentoCard>
          </Link>

          {/* Simplified District (Time handling is now in MainLayout) */}
          {/* District Card with Dynamic Time */}
          <BentoCard className="h-44 md:h-full md:w-48 shrink-0 md:aspect-square" title="District" icon="lucide:map-pin">
            <div className="flex flex-col h-full -m-0.5">
              <div className="mb-2">
                <h3 className="text-xs md:text-sm font-black tracking-tighter leading-none mb-0.5">SHIMO KITAZAWA</h3>
                <p className="text-[9px] md:text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Tokyo, JP</p>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-white italic">
                  {time || "00:00"}
                </div>
                <div className="text-[9px] md:text-[10px] text-zinc-500 font-mono tracking-[0.2em] font-bold mt-1">
                  JST / UTC+9
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 bg-zinc-900/60 px-2 py-1.5 rounded border border-zinc-800 shrink-0">
                <Icon icon="lucide:cloud-sun" width={14} height={14} className="text-amber-500" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white leading-none">8°C</span>
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-tighter">Sunny</span>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* 6. Video Spotlight */}
        <BentoCard className="col-span-2 md:col-span-2 md:row-span-4 md:col-start-4 md:row-start-4 overflow-hidden p-0 bg-black min-h-[30vh] md:min-h-0" title="" icon="" minimal>
          <div className="relative w-full h-full group">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube-nocookie.com/embed/Qp3b-RXtz4w?si=NmxAGZI-14UWDhBn"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </BentoCard>

        {/* 7. Featured Review */}
        <BentoCard className="col-span-2 md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-6 overflow-hidden p-0 min-h-[400px] md:min-h-0" title="" icon="" minimal>
          <div className="relative h-full w-full flex flex-col md:flex-row">
            <div className="w-full h-64 md:w-1/2 md:h-full relative">
              <img
                src="https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&q=80"
                alt="Review"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black"></div>
              <div className="absolute top-3 left-3">
                <Badge variant="gold">EDITOR&apos;S PICK</Badge>
              </div>
            </div>

            <div className="w-full flex-1 md:w-1/2 md:h-full flex flex-col justify-center p-5 bg-zinc-900/80 backdrop-blur-sm relative">
              <h3 className="text-2xl font-black mb-2 leading-tight tracking-tight">Serial Experiments Lain</h3>
              <p className="text-zinc-400 text-sm italic leading-relaxed mb-4">
                &quot;A cyberpunk prophecy that predicted our digital dystopia. Lain isn&apos;t just ahead of its time&mdash;it&apos;s outside of time entirely.&quot;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-violet-600 to-rose-600 rounded-full"></div>
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider text-nowrap">— WIRED COLLECTIVE</span>
              </div>
              <button className="mt-4 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 group">
                READ FULL REVIEW
                <Icon icon="lucide:arrow-right" width={12} height={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </BentoCard>
      </div>
    </MainLayout>
  );
}