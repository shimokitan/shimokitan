"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import { useTime } from '../../hooks/use-time';

import Link from '../Link';
import { locales, Locale, getLocalePath, getDictionary } from '@shimokitan/utils';
import { useLocale } from '../../hooks/use-i18n';
import { usePathname } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
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
                <div className="h-8 w-px bg-zinc-800/80 mx-1 hidden sm:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="w-9 h-9 rounded-sm bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center hover:bg-violet-600 transition-all hover:scale-105 active:scale-95 group outline-none">
                            <Icon icon="lucide:user" width={16} height={16} className="text-zinc-400 group-hover:text-white" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-zinc-950/95 border-zinc-800 backdrop-blur-xl text-zinc-100 font-mono">
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-500">{dict.identity_panel}</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <Link href="/auth/signin">
                            <DropdownMenuItem className="text-xs uppercase tracking-tight focus:bg-violet-600 focus:text-white cursor-pointer py-2">
                                <Icon icon="lucide:log-in" width={14} height={14} className="mr-2" />
                                {dict.initialize_session}
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/auth/signup">
                            <DropdownMenuItem className="text-xs uppercase tracking-tight focus:bg-violet-600 focus:text-white cursor-pointer py-2">
                                <Icon icon="lucide:user-plus" width={14} height={14} className="mr-2" />
                                {dict.register_resident}
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem className="text-[10px] uppercase text-zinc-600 opacity-50 cursor-default">
                            {dict.guest_protocol}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>

    );
}
