
import NextLink from 'next/link';
import { ComponentProps } from 'react';
import { useLocale } from '../hooks/use-i18n';
import { getLocalePath } from '@shimokitan/utils';

export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
    const locale = useLocale();
    const localizedHref = typeof href === 'string'
        ? getLocalePath(href, locale)
        : href;

    return <NextLink href={localizedHref} {...props} />;
}
