import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { getAllEntities } from '@shimokitan/db';
import ArtistsBrowser from './ArtistsBrowser';

export default async function ArtistsBrowsePage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const entities = await getAllEntities();

    // Map DB entities to the format expected by the browser component
    // Encrypted entities are excluded — they have no public surface area
    const formattedEntities = entities
        .filter((e: any) => !e.isEncrypted)
        .map((e: any) => {
        const translation = e.translations?.find((t: any) => t.locale === locale) || e.translations?.[0];
        return {
            id: e.id,
            slug: e.slug,
            name: translation?.name || "Anonymous Artist",
            type: e.type,
            avatarUrl: e.avatar?.url,
            isVerified: e.isVerified,
            artifactCount: e.credits?.length || 0
        };
    });

    return (
        <MainLayout>
            <ArtistsBrowser initialEntities={formattedEntities} />
        </MainLayout>
    );
}
