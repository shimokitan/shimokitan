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
        return {
            id: a.id,
            title: translation?.title || "Untitled",
            category: a.category,
            coverImage: a.coverImage,
            status: a.status,
            score: a.score
        };
    });

    return (
        <MainLayout>
            <ArtifactsBrowser initialArtifacts={formattedArtifacts} />
        </MainLayout>
    );
}
