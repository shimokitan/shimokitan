"use client"

import React from 'react';
import Link from '../Link';

import { useLocale } from '../../hooks/use-i18n';
import { getDictionary, Locale } from '@shimokitan/utils';

interface FooterProps {
    minimal?: boolean;
}

export function Footer({ minimal = false }: FooterProps) {
    const locale = useLocale() as Locale;
    const dict = getDictionary(locale).footer;
    const common = getDictionary(locale).common;

    return (
        <footer className={`border-t border-zinc-800/30 bg-zinc-950/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between px-6 py-4 text-[10px] shrink-0 relative z-40 gap-4 w-full ${minimal ? 'text-zinc-500' : 'text-zinc-400'}`}>
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono uppercase tracking-tight items-center">
                <Link href="/contact" className="hover:text-violet-400 transition-colors">{dict.contact_us}</Link>
                <div className="w-px h-3 bg-zinc-800" />
                <a href="https://x.com/shimokitan_off" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">X</a>
                <a href="https://www.instagram.com/shimokitan.live/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">Instagram</a>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex gap-5 font-mono uppercase tracking-widest text-[8px] md:text-[10px]">
                    <Link href="/privacy" className="hover:text-zinc-300 transition-colors">{common.privacy}</Link>
                    {!minimal && (
                        <>
                            <Link href="/terms" className="hover:text-zinc-300 transition-colors">{common.terms}</Link>
                            <Link href="/community-guidelines" className="hover:text-zinc-300 transition-colors">{dict.guidelines}</Link>
                            <Link href="/copyright" className="hover:text-zinc-300 transition-colors">{dict.copyright}</Link>
                            <Link href="/affiliate-disclosure" className="hover:text-zinc-300 transition-colors">{dict.affiliates}</Link>
                        </>
                    )}
                    <Link href="/cookies" className="hover:text-zinc-300 transition-colors">{common.cookies}</Link>
                </div>
                <div className={`font-mono tracking-[0.3em] text-[8px] md:text-[10px] uppercase font-bold ${minimal ? 'opacity-40' : 'opacity-60'}`}>
                    © 2026 SHIMOKITAN
                </div>
            </div>
        </footer>
    );
}
