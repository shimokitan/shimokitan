import React from 'react';
import { notFound } from 'next/navigation';
import { getEntityBySlug } from '@shimokitan/db';
import { EntityProfileTerminal } from '@/components/entities/EntityProfileTerminal';

export default async function AgencyAliasPage(props: { params: Promise<{ locale: string, slug: string }> }) {
    const { locale, slug: rawSlug } = await props.params;

    const decodedSlug = decodeURIComponent(rawSlug);
    const slug = decodedSlug.startsWith('@') ? decodedSlug.slice(1) : decodedSlug;

    let entity: any = null;

    try {
        entity = await getEntityBySlug(slug);
    } catch (error) {
        console.error(`SCANNER_ERROR: Failed to retrieve data for entity ${slug}.`);
    }

    if (!entity) {
        notFound();
    }

    return <EntityProfileTerminal entity={entity} locale={locale} />;
}
