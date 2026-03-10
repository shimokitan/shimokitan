import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getEntityBySlug } from '@shimokitan/db';
import { getDictionary, Locale } from '@shimokitan/utils';
import { EntityProfileTerminal } from '@/components/entities/EntityProfileTerminal';

export default async function EntityProfilePage(props: { params: Promise<{ locale: string, slug: string }> }) {
    const { locale, slug: rawSlug } = await props.params;
    const dict = getDictionary(locale as Locale);

    const decodedSlug = decodeURIComponent(rawSlug);
    
    // Legacy support for @ links — redirect to clean version
    if (decodedSlug.startsWith('@')) {
        redirect(`/${locale}/${decodedSlug.slice(1)}`);
    }
    
    const slug = decodedSlug;

    let entity: any = null;

    try {
        entity = await getEntityBySlug(slug);
    } catch (error) {
        console.error(`SCANNER_ERROR: Failed to retrieve data for entity ${slug}.`);
    }

    // Since this is a catch-all at the root level, we only show it if the entity exists.
    // If not found, we let Next.js throw a 404.
    if (!entity) {
        notFound();
    }

    return <EntityProfileTerminal entity={entity} locale={locale} dict={dict} />;
}
