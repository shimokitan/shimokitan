"use client"

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { AudioWidget } from '../components/AudioWidget';

// --- Assets & Styles ---

const styleTag = `
  .bg-noise {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 50;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  .scanlines {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0) 0px,
      rgba(0, 0, 0, 0) 1px,
      rgba(0, 0, 0, 0.1) 1px,
      rgba(0, 0, 0, 0.1) 2px
    );
    pointer-events: none;
    z-index: 45;
  }
  
  .hide-scroll::-webkit-scrollbar {
    display: none;
  }
  .hide-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }

  .hover-glitch:hover {
    animation: glitch 0.3s infinite;
  }

  @keyframes flicker {
    0% { opacity: 0.8; }
    5% { opacity: 0.9; }
    10% { opacity: 0.8; }
    15% { opacity: 1; }
    20% { opacity: 0.8; }
    25% { opacity: 0.9; }
    30% { opacity: 1; }
    70% { opacity: 0.9; }
    100% { opacity: 1; }
  }

  .animate-flicker {
    animation: flicker 4s infinite step-end;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(1deg); }
  }

  .animate-float {
    animation: float 4s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.2); }
    50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.5); }
  }

  .pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .cyber-grid {
    background-image: linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`;

// --- Components ---

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
  action?: React.ReactNode;
  minimal?: boolean;
}

const BentoCard = ({ children, className = "", title, icon, action, minimal = false }: BentoCardProps) => (
  <div className={`relative group bg-zinc-900/80 border border-zinc-800/80 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 backdrop-blur-xl flex flex-col ${className}`}>
    {/* Background Decorative Grid */}
    <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

    {/* Technical Marking - Top Right */}
    <div className="absolute top-1 right-1 flex gap-0.5 pointer-events-none opacity-40">
      <div className="w-1 h-1 bg-zinc-700 rounded-full" />
      <div className="w-1 h-1 bg-zinc-700 rounded-full" />
    </div>

    {/* Technical Marking - Corners */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700/50 rounded-tl-sm pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-700/50 rounded-br-sm pointer-events-none" />

    {!minimal && (
      <div className="flex items-center h-8 px-4 bg-zinc-950/50 border-b border-zinc-800/50 z-10">
        <div className="flex items-center gap-2 text-zinc-500 group-hover:text-violet-400 transition-colors">
          {icon && <Icon icon={icon} width={10} height={10} />}
          {title && <span className="text-[9px] font-mono tracking-[0.2em] uppercase font-black">{title}</span>}
        </div>
        <div className="flex-1" />
        {action && <div className="text-zinc-600 hover:text-white cursor-pointer transition-colors z-20">{action}</div>}
      </div>
    )}

    <div className={`relative z-10 flex-1 flex flex-col h-full min-h-0 ${!minimal ? 'p-4' : ''}`}>
      {children}
    </div>

    {/* Hover Glow Layer */}
    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  type?: "default" | "gold" | "truth" | "distortion" | "clean";
}

const Badge = ({ children, type = "default" }: BadgeProps) => {
  const styles: Record<string, string> = {
    default: "bg-zinc-800/50 text-zinc-400 border-zinc-700/30",
    gold: "bg-amber-900/40 text-amber-400 border-amber-700/60",
    truth: "bg-emerald-900/40 text-emerald-400 border-emerald-700/60",
    distortion: "bg-rose-900/40 text-rose-400 border-rose-700/60",
    clean: "bg-violet-900/40 text-violet-400 border-violet-700/60",
  };
  return (
    <span className={`px-2 py-0.5 rounded-sm text-[8px] font-mono border backdrop-blur-md tracking-tighter uppercase ${styles[type]}`}>
      {children}
    </span>
  );
};

interface NavigationLinkProps {
  icon: string;
  label: string;
  active?: boolean;
}

const NavigationLink = ({ icon, label, active = false }: NavigationLinkProps) => (
  <button className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${active ? 'bg-zinc-100 text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-zinc-900/80 text-zinc-500 hover:bg-zinc-800 hover:text-white border border-zinc-800/50'}`}>
    <Icon icon={icon} width={18} height={18} />
    <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-700 z-50 shadow-xl">
      {label}
    </span>
  </button>
);

// --- Main App ---

export default function App() {
  const [time, setTime] = useState<string>("");
  const [activeSpotlight, setActiveSpotlight] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="bg-black text-white h-screen w-screen overflow-hidden flex flex-col font-sans selection:bg-violet-500/40 selection:text-violet-100 italic-selection">
      <style>{styleTag}</style>
      <div className="bg-noise" />
      <div className="scanlines" />

      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-900/5 rounded-full blur-[100px]" />
      </div>

      {/* --- Navbar --- */}
      <header className="h-14 border-b border-zinc-800/80 flex items-center justify-between px-4 bg-zinc-950/40 backdrop-blur-2xl z-40 shrink-0 relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-violet-600 rounded-sm rotate-45 pulse-glow" />
              <div className="absolute inset-0 w-3 h-3 bg-violet-400 rounded-sm rotate-45 animate-ping opacity-20" />
            </div>
            <div className="flex flex-col leading-none">
              <h1 className="font-black tracking-tighter text-lg italic uppercase">SHIMOKITAN</h1>
              <span className="text-zinc-600 text-[8px] font-mono tracking-[0.3em] font-bold">V.2.0.26 // DIGITAL_DISTRICT</span>
            </div>
          </div>

          <div className="hidden lg:flex gap-4 items-center h-8 border-l border-zinc-800/80 pl-6">
            <div className="flex flex-col">
              <span className="text-zinc-500 text-[7px] font-mono uppercase">System Status</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-500/80 text-[9px] font-mono font-bold tracking-tight uppercase">Operational</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 text-[7px] font-mono uppercase">Location</span>
              <span className="text-zinc-300 text-[9px] font-mono font-bold tracking-tight uppercase">TyO-Dist_012</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-sm px-3 py-1.5 flex items-center gap-2 w-32 sm:w-48 md:w-64 backdrop-blur-md group focus-within:border-violet-500/50 transition-colors">
            <Icon icon="lucide:search" width={12} height={12} className="text-zinc-600 group-focus-within:text-violet-400" />
            <input
              type="text"
              placeholder="Query database..."
              className="bg-transparent border-none outline-none text-[9px] w-full placeholder-zinc-700 text-zinc-300 font-mono"
            />
          </div>
          <div className="h-8 w-px bg-zinc-800/80 mx-1 hidden sm:block" />
          <button className="w-9 h-9 rounded-sm bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center hover:bg-violet-600 transition-all hover:scale-105 active:scale-95 group">
            <Icon icon="lucide:user" width={16} height={16} className="text-zinc-400 group-hover:text-white" />
          </button>
        </div>
      </header>

      {/* --- Main Layout: Sidebar + Bento --- */}
      <main className="flex-1 flex p-4 gap-4 overflow-y-auto md:overflow-hidden relative z-30 hide-scroll">

        {/* Floating Sidebar */}
        <nav className="hidden md:flex flex-col gap-3 shrink-0 justify-center z-50">
          <div className="bg-zinc-950/40 border border-zinc-800/80 p-2 rounded-xl backdrop-blur-2xl flex flex-col gap-3 shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

            <NavigationLink icon="lucide:radio" label="The District" active />
            <NavigationLink icon="lucide:disc" label="Crate Digging" />
            <NavigationLink icon="lucide:layers" label="Pedalboard" />
            <NavigationLink icon="lucide:ghost" label="Back-Alley" />
            <div className="h-px bg-zinc-800/80 w-full my-1" />
            <NavigationLink icon="lucide:headphones" label="Mixtapes" />
            <NavigationLink icon="lucide:tv" label="Live Feed" />
          </div>
        </nav>

        {/* Bento Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-5 md:grid-rows-7 gap-3 h-auto md:h-full">

          {/* 1. Hero / Magazine Cover */}
          <div className="col-span-2 md:col-span-3 md:row-span-3 relative group rounded-xl overflow-hidden border border-zinc-800/80 hover:border-violet-500/50 transition-all min-h-[45vh] md:min-h-0 bg-zinc-950 shadow-2xl">
            {/* Technical Markings */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 pointer-events-none">
              <div className="flex gap-1">
                <div className="w-2 h-0.5 bg-violet-500" />
                <div className="w-8 h-0.5 bg-zinc-800" />
              </div>
              <span className="text-[7px] font-mono text-zinc-500 font-bold uppercase tracking-[0.2em]">Data // Visual_Link_02</span>
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
              <Badge type="distortion">ISSUE_012</Badge>
              <Badge type="truth">RES_HIGH_W26</Badge>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-8 z-10">
              <div className="w-12 h-1 bg-violet-600 mb-6" />
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] text-white mb-4 hover-glitch italic">
                VOID<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400">STATE.</span>
              </h2>

              <p className="text-zinc-400 text-[10px] font-mono leading-relaxed max-w-xs mb-8 uppercase tracking-wide">
                Archive the friction. <span className="text-violet-400 opacity-60">//</span> Reject the sterile. <span className="text-violet-400 opacity-60">//</span> Embrace the noise of the street.
              </p>

              <div className="flex gap-3">
                <button className="bg-violet-600 text-white px-6 py-2 rounded-sm text-[10px] font-black tracking-widest hover:bg-violet-500 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] group">
                  INITIALIZE <Icon icon="lucide:zap" width={12} height={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border border-zinc-700 bg-zinc-900/40 text-zinc-400 px-6 py-2 rounded-sm text-[10px] font-black tracking-widest hover:border-zinc-400 hover:text-white transition-all backdrop-blur-md">
                  METADATA
                </button>
              </div>
            </div>

            {/* Digital Corner Accent */}
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-violet-500/30 pointer-events-none" />
          </div>

          {/* 2. The Pit (Now Playing) - MORE COMPACT */}
          {/* 3. Featured Spotlight - Mobile Carousel / Desktop Fan */}
          <BentoCard className="col-span-2 md:col-span-1 md:row-span-3 overflow-visible min-h-[340px] md:min-h-0" title="Featured Zines" icon="lucide:star">

            {/* Unified View: Fanned Stack for both Mobile and Desktop */}
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
                    <div className="bg-white p-2 rounded-lg shadow-2xl border-2 border-zinc-800 w-36 md:w-44 hover-glitch">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-28 md:h-36 object-cover rounded shadow-inner"
                      />
                      <div className="mt-2 px-1 pb-1">
                        <div className="text-[10px] font-bold text-black line-clamp-1 mb-1">{item.title}</div>
                        <Badge type={item.tag.toLowerCase() as BadgeProps["type"]}>{item.tag}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto text-center pb-2">
                <p className="text-[9px] text-zinc-500 font-mono flex items-center gap-1 justify-center">
                  <span className="w-1 h-1 rounded-full bg-violet-500"></span>
                  {activeSpotlight + 1} / {spotlightItems.length}
                </p>
              </div>
            </div>
          </BentoCard>

          {/* 2. The Pit (Now Playing) - Side by Side with Echoes */}
          <BentoCard className="col-span-1 md:col-span-1 md:row-span-3 min-h-[25vh] md:min-h-0" title="In The Pit" icon="lucide:flame" action={<Icon icon="lucide:more-horizontal" width={14} height={14} />}>
            <div className="flex flex-col h-full -m-1">
              <div className="relative flex-1 rounded-lg overflow-hidden mb-2 border border-zinc-800/50 group-hover:border-violet-500/50 transition-all hover-glitch min-h-0">
                <img
                  src="https://images.unsplash.com/photo-1548502669-522718227b26?q=80&w=600&auto=format&fit=crop"
                  alt="Now Playing"
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-1.5 left-1.5 bg-black/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] text-white font-mono border border-zinc-700/50">
                  EP 08 • LIVE
                </div>
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center backdrop-blur-sm">
                    <Icon icon="lucide:play" width={20} height={20} className="text-black ml-0.5" />
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold leading-tight mb-1">Bocchi the Rock!</h3>
              <p className="text-[9px] text-zinc-500 italic line-clamp-2 mb-2">"Fuzz-drenched anthem for bedroom guitarists."</p>

              <div className="mt-auto flex items-center gap-1">
                <Badge type="truth">TRUTH</Badge>
                <Badge type="distortion">NOISE</Badge>
              </div>
            </div>
          </BentoCard>

          {/* 4. Soundtrack - Square Audio Player */}
          {/* 6. Recent Echoes - Side by Side with Pit */}
          <BentoCard className="col-span-1 md:col-span-1 md:row-span-2 md:col-start-3 md:row-start-4 min-h-[25vh] md:min-h-0" title="Recent Echoes" icon="lucide:ghost" action={<div className="text-[9px] underline cursor-pointer">All</div>}>
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
                    <span className="text-[9px] font-bold text-white line-clamp-1 hidden md:block">{echo.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* 4 & 5. Combined Row for Soundtrack & District */}
          <div className="col-span-2 md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-4 flex flex-col md:flex-row gap-2.5">
            {/* 4. Soundtrack - LARGER */}
            <BentoCard className="flex-1 h-36 md:h-full" title="Soundtrack" icon="lucide:disc">
              <div className="flex flex-row items-center h-full gap-4 -m-1">
                {/* Album Art - Square */}
                <div className="relative aspect-square h-24 md:h-full rounded-lg overflow-hidden border border-zinc-800/50 group-hover:border-violet-500/50 transition-all shrink-0 shadow-lg">
                  <img
                    src={albumCovers[0].img}
                    alt={albumCovers[0].title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>

                {/* Right Side: Info + Controls */}
                <div className="flex flex-col flex-1 py-1 pr-1 min-w-0 h-full md:justify-center">
                  {/* Track Info */}
                  <div className="px-0.5 md:mb-1">
                    <h4 className="text-base font-black text-white leading-tight truncate uppercase tracking-tighter">{albumCovers[0].title}</h4>
                    <p className="text-xs text-zinc-500 font-mono truncate uppercase mt-0.5 tracking-wide">{albumCovers[0].artist}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 px-0.5 mt-auto mb-2 md:mt-1.5 md:mb-1.5">
                    <span className="text-[8px] text-zinc-600 font-mono shrink-0">1:24</span>
                    <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full w-2/5 transition-all"></div>
                    </div>
                    <span className="text-[8px] text-zinc-600 font-mono shrink-0">3:47</span>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center justify-between md:justify-center gap-5 md:mt-1 pb-1">
                    <button className="text-zinc-500 hover:text-white transition-colors">
                      <Icon icon="lucide:skip-back" width={14} height={14} />
                    </button>
                    <button
                      onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    >
                      <Icon icon={isAudioPlaying ? "lucide:pause" : "lucide:play"} width={16} height={16} className="text-black ml-0.5" />
                    </button>
                    <button className="text-zinc-500 hover:text-white transition-colors">
                      <Icon icon="lucide:skip-forward" width={14} height={14} />
                    </button>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* 5. District - SMALLER/SQUARE */}
            <BentoCard className="h-32 md:h-full md:w-48 shrink-0 md:aspect-square" title="District" icon="lucide:map-pin">
              <div className="flex flex-row md:flex-col h-full justify-between items-center md:items-start -m-0.5">
                {/* Location */}
                <div className="flex-1 md:flex-none">
                  <h3 className="text-base md:text-lg font-black tracking-tighter leading-none mb-0.5">SHIMO<br className="hidden md:block" />KITAZAWA</h3>
                  <p className="text-[8px] md:text-[9px] text-zinc-500 font-mono tracking-widest uppercase">Tokyo, JP</p>
                </div>

                {/* Time */}
                <div className="my-0 md:my-0 text-right md:text-left">
                  <div className="text-xl md:text-3xl font-mono font-bold tracking-tight text-white leading-none">{time}</div>
                  <p className="text-[8px] md:text-[9px] text-zinc-600 font-mono mt-1 uppercase">JST / UTC+9</p>
                </div>

                {/* Weather */}
                <div className="mt-0 md:mt-2 flex items-center gap-2 bg-zinc-800/40 rounded-lg px-2 py-1 border border-zinc-700/30 shrink-0">
                  <Icon icon="lucide:cloud-sun" width={16} height={16} className="text-amber-400" />
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-bold text-white">8°C</span>
                    <span className="text-[6px] text-zinc-600 font-mono uppercase hidden md:block">Sunny</span>
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

          {/* 7. Featured Review - SPLIT LAYOUT */}
          <BentoCard className="col-span-2 md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-6 overflow-hidden p-0 min-h-[400px] md:min-h-0" title="" icon="" minimal>
            <div className="relative h-full w-full flex flex-col md:flex-row">
              {/* Image Side - BIGGER */}
              <div className="w-full h-64 md:w-1/2 md:h-full relative">
                <img
                  src="https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&q=80"
                  alt="Review"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black"></div>

                {/* Floating Badge on Image */}
                <div className="absolute top-3 left-3">
                  <Badge type="gold">EDITOR'S PICK</Badge>
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full flex-1 md:w-1/2 md:h-full flex flex-col justify-center p-5 bg-zinc-900/80 backdrop-blur-sm relative">
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-600/10 to-transparent pointer-events-none"></div>

                <h3 className="text-2xl font-black mb-2 leading-tight tracking-tight">Serial Experiments Lain</h3>
                <p className="text-zinc-400 text-xs italic leading-relaxed mb-4">
                  "A cyberpunk prophecy that predicted our digital dystopia. Lain isn't just ahead of its time—it's outside of time entirely."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-violet-600 to-rose-600 rounded-full"></div>
                  <span className="text-[9px] text-zinc-500 font-mono tracking-wider">— WIRED COLLECTIVE</span>
                </div>

                {/* Read More Link */}
                <button className="mt-4 text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 group">
                  READ FULL REVIEW
                  <Icon icon="lucide:arrow-right" width={12} height={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </BentoCard>

        </div>
      </main>

      {/* --- Audio Widget Integration --- */}
      <AudioWidget />

      {/* --- Footer --- */}
      <footer className="h-20 md:h-10 border-t border-zinc-800/30 bg-zinc-950/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-center md:justify-end px-6 text-[10px] text-zinc-500 shrink-0 relative z-40 gap-3 md:gap-10">
        <div className="flex gap-6 font-mono">
          <a href="#" className="hover:text-zinc-300 transition-colors tracking-tight">PRIVACY</a>
          <a href="#" className="hover:text-zinc-300 transition-colors tracking-tight">TERMS</a>
          <a href="#" className="hover:text-zinc-300 transition-colors tracking-tight">GUIDELINES</a>
        </div>
        <div className="font-mono opacity-60 tracking-widest text-[9px] uppercase">
          © 2026 SHIMOKITAN PROJECT
        </div>
      </footer>
    </div>
  );
}