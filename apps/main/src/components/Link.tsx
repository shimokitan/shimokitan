"use client"

import NextLink from 'next/link';
import { ComponentProps } from 'react';
import { useParams } from 'next/navigation';
import { getLocalePath, defaultLocale, Locale } from '@shimokitan/utils';

interface LinkProps extends ComponentProps<typeof NextLink> {
    locale?: string;
}

export default function Link({ href, locale: propLocale, ...props }: LinkProps) {
    const params = useParams();
    const currentLocale = (propLocale as Locale) || (params?.locale as Locale) || defaultLocale;

    const localizedHref = typeof href === 'string'
        ? getLocalePath(href, currentLocale)
        : href;

    return <NextLink href={localizedHref} {...props} />;
}
