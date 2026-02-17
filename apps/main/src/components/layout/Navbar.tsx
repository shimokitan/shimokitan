"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import { useTime } from '../../hooks/use-time';

import Link from '../Link';
import { locales, Locale, getLocalePath, getDictionary } from '@shimokitan/utils';
import { useLocale } from '../../hooks/use-i18n';
import { usePathname } from 'next/navigation';
import {
    cn
} from '@shimokitan/ui';

export function Navbar() {
    const time = useTime();
    const currentLocale = useLocale() as Locale;
    const pathname = usePathname();
    const dict = getDictionary(currentLocale).navbar;

    const redirectedPathname = (locale: string) => {
        if (!pathname) return "/";
        const segments = pathname.split("/");
        if (segments.length <= 1) return `/${locale}`;
        segments[1] = locale;
        return segments.join("/");
    };

    return (
        <header className="h-14 border-b border-zinc-800/80 flex items-center justify-between px-4 bg-zinc-950/40 backdrop-blur-2xl z-40 shrink-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="w-3 h-3 bg-violet-600 rounded-sm rotate-45 pulse-glow group-hover:bg-violet-500 transition-colors" />
                        <div className="absolute inset-0 w-3 h-3 bg-violet-400 rounded-sm rotate-45 animate-ping opacity-20" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <h1 className="font-black tracking-tighter text-lg italic uppercase group-hover:text-violet-400 transition-colors text-white">SHIMOKITAN</h1>
                        <span className="text-zinc-500 text-[10px] font-mono tracking-[0.3em] font-bold group-hover:text-zinc-400 transition-colors">V.2.0.26 // DIGITAL_DISTRICT</span>
                    </div>
                </Link>

                <div className="hidden lg:flex gap-4 items-center h-8 border-l border-zinc-800/80 pl-6">
                    <div className="flex flex-col">
                        <span className="text-zinc-400 text-[9px] font-mono uppercase">{dict.system_status}</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-emerald-500/80 text-[10px] font-mono font-bold tracking-tight uppercase">{dict.operational}</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-zinc-400 text-[9px] font-mono uppercase">{dict.location}</span>
                        <span className="text-zinc-300 text-[10px] font-mono font-bold tracking-tight uppercase">TyO-Dist_012</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-zinc-400 text-[9px] font-mono uppercase">{dict.time}</span>
                        <span className="text-zinc-100 text-[10px] font-mono font-bold tracking-tight uppercase">{time} JST</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Language Switcher */}
                <div className="flex gap-2 mr-2 border-r border-zinc-800 pr-4 h-6 items-center">
                    {locales.map((l) => (
                        <a
                            key={l}
                            href={redirectedPathname(l)}
                            className={cn(
                                "text-[10px] font-black tracking-widest transition-colors px-1.5 py-0.5 rounded-sm uppercase",
                                currentLocale === l
                                    ? "bg-violet-600/20 text-violet-400 border border-violet-500/30"
                                    : "text-zinc-600 hover:text-zinc-300"
                            )}
                        >
                            {l}
                        </a>
                    ))}
                </div>

                <Link href="/about" className="text-zinc-500 hover:text-white transition-colors">
                    <Icon icon="lucide:info" width={18} height={18} />
                </Link>

                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-sm px-3 py-1.5 flex items-center gap-2 w-32 sm:w-48 md:w-64 backdrop-blur-md group focus-within:border-violet-500/50 transition-colors">
                    <Icon icon="lucide:search" width={12} height={12} className="text-zinc-500 group-focus-within:text-violet-400" />
                    <input
                        type="text"
                        placeholder={dict.search_placeholder}
                        className="bg-transparent border-none outline-none text-xs w-full placeholder-zinc-500 text-zinc-300 font-mono"
                    />
                </div>
            </div>
        </header>

    );
}
