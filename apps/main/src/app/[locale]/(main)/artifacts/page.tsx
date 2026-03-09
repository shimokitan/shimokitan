import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { getAllArtifacts } from '@shimokitan/db';
import ArtifactsBrowser from './ArtifactsBrowser';

export default async function ArtifactsBrowsePage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const artifacts = await getAllArtifacts();

    // Map DB artifacts to the format expected by the browser component
    const formattedArtifacts = artifacts.map((a: any) => {
        const translation = a.translations?.find((t: any) => t.locale === locale) || a.translations?.[0];
        const primaryCredit = a.credits?.find((c: any) => c.isPrimary && (c.contributorClass === 'author' || c.contributorClass === 'collaborator')) || a.credits?.[0];
        const artistName = primaryCredit?.entity?.translations?.find((t: any) => t.locale === locale)?.name ||
            primaryCredit?.entity?.translations?.[0]?.name;

        return {
            id: a.id,
            title: translation?.title || "Untitled",
            category: a.category || "UNKNOWN",
            coverImage: a.cover?.url || null,
            status: a.status,
            resonance: a.resonance || 0,
            isMajor: (a.resonance || 0) > 10, // Featured based on Resonance Threshold
            isVerified: a.isVerified ?? false,
            artist: artistName || "ANONYMOUS"
        };
    });

    return (
        <MainLayout>
            <ArtifactsBrowser initialArtifacts={formattedArtifacts} />
        </MainLayout>
    );
}
