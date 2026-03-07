"use client"

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from '../Link';
import { cn } from '@shimokitan/ui';

interface RibbonLink {
    href: string;
    label: string;
}

interface MobileNavRibbonProps {
    links: RibbonLink[];
    className?: string;
}

export function MobileNavRibbon({ links, className }: MobileNavRibbonProps) {
    const pathname = usePathname();

    return (
        <nav className={cn(
            "lg:hidden flex overflow-x-auto hide-scroll -mx-6 px-6 gap-2 pb-2 border-b border-zinc-900",
            className
        )}>
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "whitespace-nowrap px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                            isActive
                                ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                        )}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}
