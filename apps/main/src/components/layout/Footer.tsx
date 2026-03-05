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
        <footer className={`border-t border-zinc-800/30 bg-zinc-950/20 backdrop-blur-xl flex items-center justify-center px-6 py-4 text-[10px] md:text-xs shrink-0 relative z-40 w-full ${minimal ? 'text-zinc-500' : 'text-zinc-400'}`}>
            <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-2 font-mono uppercase tracking-widest text-[9px] md:text-[10px] items-center">
                <Link href="/privacy" className="hover:text-violet-400 transition-colors uppercase">{common.privacy}</Link>
                {!minimal && (
                    <>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                        <Link href="/terms" className="hover:text-zinc-300 transition-colors uppercase">{common.terms}</Link>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                        <Link href="/community-guidelines" className="hover:text-zinc-300 transition-colors uppercase">{dict.guidelines}</Link>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                        <Link href="/copyright" className="hover:text-zinc-300 transition-colors uppercase">{dict.copyright}</Link>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                        <Link href="/affiliate-disclosure" className="hover:text-zinc-300 transition-colors uppercase">{dict.affiliates}</Link>
                    </>
                )}
                <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                <Link href="/cookies" className="hover:text-zinc-300 transition-colors uppercase">{common.cookies}</Link>
            </div>
        </footer>
    );
}
