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
        <footer className={`border-t border-zinc-800/30 bg-zinc-950/20 backdrop-blur-xl flex items-center justify-center px-6 py-6 md:py-4 text-[10px] md:text-xs shrink-0 relative z-40 w-full ${minimal ? 'text-zinc-500' : 'text-zinc-400'}`}>
            <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-4 md:gap-x-6 md:gap-y-2 font-mono uppercase tracking-widest text-[10px] sm:text-[10px]">
                <Link href="/privacy" className="px-2 py-2 md:py-1 hover:text-violet-400 transition-colors uppercase">{common.privacy}</Link>
                {!minimal && (
                    <>
                        <div className="hidden md:block w-1 h-1 bg-zinc-800 rounded-full" />
                        <Link href="/terms" className="px-2 py-2 md:py-1 hover:text-zinc-300 transition-colors uppercase">{common.terms}</Link>
                        <div className="hidden md:block w-1 h-1 bg-zinc-800 rounded-full" />
                        <Link href="/community-guidelines" className="px-2 py-2 md:py-1 hover:text-zinc-300 transition-colors uppercase">{dict.guidelines}</Link>
                        <div className="hidden md:block w-1 h-1 bg-zinc-800 rounded-full" />
                        <Link href="/copyright" className="px-2 py-2 md:py-1 hover:text-zinc-300 transition-colors uppercase">{dict.copyright}</Link>
                        <div className="hidden md:block w-1 h-1 bg-zinc-800 rounded-full" />
                        <Link href="/affiliate-disclosure" className="px-2 py-2 md:py-1 hover:text-zinc-300 transition-colors uppercase">{dict.affiliates}</Link>
                        <div className="hidden md:block w-1 h-1 bg-zinc-800 rounded-full" />
                        <Link href="/faq" className="px-2 py-2 md:py-1 hover:text-zinc-300 transition-colors uppercase">{dict.faq || 'FAQ'}</Link>
                    </>
                )}
                <div className="hidden md:block w-1 h-1 bg-zinc-800 rounded-full" />
                <Link href="/cookies" className="px-2 py-2 md:py-1 hover:text-zinc-300 transition-colors uppercase">{common.cookies}</Link>
            </div>
        </footer>
    );
}
