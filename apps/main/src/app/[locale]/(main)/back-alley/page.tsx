import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { getAllArtifacts } from '@shimokitan/db';
import BackAlleyBrowser from './BackAlleyBrowser';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Back Alley",
};

export default async function BackAlleyPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const artifacts = await getAllArtifacts();

    // Map DB artifacts to the format expected by the browser component
    // Filter out only music items
    const formattedArtifacts = artifacts
        .filter((a: any) => a.category === 'music')
        .map((a: any) => {
            const translation = a.translations?.find((t: any) => t.locale === locale) || a.translations?.[0];
            const primaryCredit = a.credits?.find((c: any) => c.isPrimary && (c.contributorClass === 'author' || c.contributorClass === 'collaborator')) || a.credits?.[0];
            const artistName = primaryCredit?.entity?.translations?.find((t: any) => t.locale === locale)?.name ||
                primaryCredit?.entity?.translations?.[0]?.name;

            return {
                id: a.id,
                slug: a.slug,
                title: translation?.title || "Untitled",
                category: a.category || "UNKNOWN",
                nature: a.nature || "original",
                coverImage: a.thumbnail?.url || a.poster?.url || null,
                status: a.status,
                resonance: a.resonance || 0,
                isMajor: (a.resonance || 0) > 10,
                isVerified: a.isVerified ?? false,
                artist: artistName || "ANONYMOUS"
            };
        });

    return (
        <MainLayout>
            <BackAlleyBrowser initialArtifacts={formattedArtifacts} />
        </MainLayout>
    );
}
