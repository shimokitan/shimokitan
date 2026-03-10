"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import { cn } from "../lib/utils";
import Link from 'next/link';

interface NavigationLinkProps {
    icon: string;
    label: string;
    active?: boolean;
    onClick?: () => void;
    href?: string;
    target?: string;
    rel?: string;
}

export const NavigationLink = ({
    icon,
    label,
    active = false,
    onClick,
    href,
    target,
    rel
}: NavigationLinkProps) => {
    const content = (
        <button
            onClick={onClick}
            className={cn(
                "w-12 h-12 aspect-square shrink-0 rounded-2xl flex items-center justify-center transition-all duration-200",
                active
                    ? 'bg-zinc-100 text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                    : 'bg-zinc-900/80 text-zinc-500 hover:bg-zinc-800 hover:text-white border border-zinc-800/50'
            )}
        >
            <Icon icon={icon} width={24} height={24} />
        </button>
    );

    return (
        <div className="relative group flex items-center cursor-pointer">
            {href ? (
                href.startsWith('http') ? (
                    <a href={href} target={target} rel={rel} className="block">
                        {content}
                    </a>
                ) : (
                    <Link href={href} className="block">
                        {content}
                    </Link>
                )
            ) : content}

            {/* Floating Tooltip - Firmly to the Right */}
            <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[100] translate-x-2 group-hover:translate-x-4">
                <div className="bg-black border border-zinc-800 px-3 py-1.5 rounded-sm shadow-[0_0_40px_rgba(0,0,0,1)] flex items-center gap-2.5 whitespace-nowrap">
                    <div className="w-1.5 h-1.5 bg-violet-600 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)] animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest text-zinc-100 uppercase">{label}</span>
                </div>
            </div>
        </div>
    );
};
