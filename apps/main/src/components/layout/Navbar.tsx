"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import { useTime } from '../../hooks/use-time';

import Link from '../Link';
import { locales, Locale, getLocalePath, getDictionary } from '@shimokitan/utils';
import { useLocale } from '../../hooks/use-i18n';
import { usePathname } from 'next/navigation';
import {
    cn,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@shimokitan/ui';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-neon/client';

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

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const router = useRouter();

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/auth/signin');
        router.refresh();
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
                <div className="hidden sm:flex gap-2 mr-2 border-r border-zinc-800 pr-4 h-6 items-center">
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

                <div className="hidden sm:flex items-center gap-4">
                    <Link href="/about" className="text-zinc-500 hover:text-white transition-colors">
                        <Icon icon="lucide:info" width={18} height={18} />
                    </Link>

                    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-sm px-3 py-1.5 flex items-center gap-2 w-32 sm:w-48 backdrop-blur-md group focus-within:border-violet-500/50 transition-colors">
                        <Icon icon="lucide:search" width={12} height={12} className="text-zinc-500 group-focus-within:text-violet-400" />
                        <input
                            type="text"
                            placeholder={dict.search_placeholder}
                            className="bg-transparent border-none outline-none text-xs w-full placeholder-zinc-500 text-zinc-300 font-mono"
                        />
                    </div>

                    <div className="h-4 w-px bg-zinc-800 mx-2" />
                </div>

                {mounted && !isPending && (
                    <>
                        {user ? (
                            <div className="flex items-center gap-4 animate-in fade-in duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:flex flex-col items-end leading-none">
                                        <span className="text-white text-[10px] font-black uppercase tracking-tight">{user.name || 'Resident'}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-sm bg-zinc-900 border border-zinc-800 overflow-hidden">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                <Icon icon="lucide:user" width={16} />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="hidden sm:block p-1 px-2 text-zinc-600 hover:text-rose-500 transition-colors border border-transparent hover:border-zinc-800 rounded-sm"
                                        title="Disconnect"
                                    >
                                        <Icon icon="lucide:power" width={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/auth/signin"
                                className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/20"
                            >
                                <Icon icon="lucide:power" width={14} />
                                {dict.initialize_session}
                            </Link>
                        )}
                    </>
                )}

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button suppressHydrationWarning className="p-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/50 rounded border border-zinc-800">
                                <Icon icon="lucide:menu" width={20} />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-zinc-950/95 border-zinc-800 w-[85vw] backdrop-blur-xl p-0 overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                            <SheetHeader className="p-6 border-b border-zinc-900 bg-zinc-950/50">
                                <SheetTitle className="text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-violet-600 rounded-sm rotate-45 pulse-glow" />
                                        <div className="flex flex-col leading-none">
                                            <span className="font-black tracking-tighter text-lg italic uppercase text-white">SHIMOKITAN</span>
                                            <span className="text-zinc-500 text-[10px] font-mono tracking-[0.3em] font-bold">MOBILE_ACCESS</span>
                                        </div>
                                    </div>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col h-full">
                                <nav className="p-4 grid gap-2">
                                    <MobileNavLink icon="lucide:radio" label="The District" href="/" active={pathname === "/"} />
                                    <MobileNavLink icon="lucide:disc" label="Crate Digging" href="/artifacts" active={pathname?.startsWith("/artifacts")} />
                                    <MobileNavLink icon="lucide:users" label="Artists" href="/artists" active={pathname?.startsWith("/artists")} />
                                    <MobileNavLink icon="lucide:message-square-plus" label="Echo Pulse" href="/zines" active={pathname?.startsWith("/zines")} />
                                    <MobileNavLink icon="lucide:command" label="Pedalboard" href="/pedalboard" active={pathname?.startsWith("/pedalboard")} />
                                </nav>

                                <div className="mt-auto p-6 border-t border-zinc-900 bg-zinc-950/80 space-y-6">
                                    <div className="grid gap-2">
                                        <MobileNavLink icon="lucide:mail" label="Contact Protocol" href="/contact" active={pathname === "/contact"} />
                                    </div>

                                    {/* Socials / Technical Readouts */}
                                    <div className="flex flex-col gap-5">
                                        <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                                            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">External Uplinks</span>
                                            <div className="flex items-center gap-4">
                                                <a href="https://x.com/shimokitan_off" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                                                    <Icon icon="simple-icons:x" width={16} />
                                                </a>
                                                <a href="https://www.instagram.com/shimokitan.live/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                                                    <Icon icon="simple-icons:instagram" width={16} />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-[10px] font-mono">
                                                <span className="text-zinc-500 uppercase">System Time</span>
                                                <span className="text-zinc-300 font-bold tracking-tight">{time} JST</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-mono">
                                                <span className="text-zinc-500 uppercase">District Region</span>
                                                <span className="text-emerald-500 font-bold tracking-tight">TyO-Dist_012</span>
                                            </div>
                                        </div>

                                        {mounted && (
                                            <>
                                                {user ? (
                                                    <div className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-900 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded border border-zinc-800 overflow-hidden bg-zinc-900">
                                                                {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700"><Icon icon="lucide:user" width={16} /></div>}
                                                            </div>
                                                            <span className="text-white text-[11px] font-black uppercase italic">{user.name}</span>
                                                        </div>
                                                        <button onClick={handleLogout} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded border border-rose-500/20 transition-all">
                                                            <Icon icon="lucide:power" width={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <Link href="/auth/signin" className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 text-white text-xs font-black uppercase tracking-widest rounded hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/20">
                                                        <Icon icon="lucide:power" width={16} />
                                                        INITIALIZE_SESSION
                                                    </Link>
                                                )}
                                            </>
                                        )}

                                        <div className="text-center pt-2">
                                            <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.4em] font-bold">
                                                © 2026 SHIMOKITAN // ALL_RIGHTS_RESERVED
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

function MobileNavLink({ icon, label, href, active }: { icon: string, label: string, href: string, active: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-lg border transition-all duration-300 group",
                active
                    ? "bg-violet-600/10 border-violet-500/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                    : "bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700"
            )}
        >
            <div className={cn(
                "w-1.5 h-6 rounded-full transition-all duration-300",
                active ? "bg-violet-600" : "bg-transparent group-hover:bg-zinc-700"
            )} />
            <Icon icon={icon} width={20} className={cn(active ? "text-violet-400" : "")} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] font-mono">{label}</span>
            {active && (
                <div className="ml-auto w-1 h-1 bg-violet-500 animate-ping rounded-full" />
            )}
        </Link>
    );
}
