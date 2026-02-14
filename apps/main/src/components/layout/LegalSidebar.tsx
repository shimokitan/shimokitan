"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@shimokitan/ui';

const links = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/community-guidelines', label: 'Guidelines' },
    { href: '/copyright', label: 'Copyright' },
    { href: '/dmca', label: 'DMCA' },
    { href: '/cookies', label: 'Cookies' },
];

export function LegalSidebar() {
    const pathname = usePathname();

    return (
        <nav className="hidden lg:block w-64 shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-8 border-r border-zinc-800/50">
            <div className="flex flex-col gap-1">
                <div className="mb-6 px-3">
                    <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold">
                        Legal Documents
                    </h3>
                </div>
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "group flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
                                isActive
                                    ? "bg-violet-900/10 text-violet-300 border border-violet-500/20"
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                            )}
                        >
                            <span>{link.label}</span>
                            {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-12 px-3">
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm">
                    <h4 className="text-xs font-semibold text-zinc-300 mb-2">Need Help?</h4>
                    <p className="text-[10px] text-zinc-500 leading-relaxed mb-3">
                        If you have questions about our policies, please contact our legal team.
                    </p>
                    <a
                        href="mailto:legal@shimokitan.live"
                        className="text-[10px] font-mono text-violet-400 hover:text-violet-300 uppercase tracking-wide border-b border-violet-500/30 hover:border-violet-400 transition-colors pb-0.5"
                    >
                        legal@shimokitan.live
                    </a>
                </div>
            </div>
        </nav>
    );
}
