import React from 'react';
import { MainLayout } from '../../../components/layout/MainLayout';
import { getAllArtifacts } from '@shimokitan/db';
import ArtifactsBrowser from './ArtifactsBrowser';

export default async function ArtifactsBrowsePage() {
    const artifacts = await getAllArtifacts();

    // Map DB artifacts to the format expected by the browser component
    const formattedArtifacts = artifacts.map((a: any) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        coverImage: a.coverImage,
        status: a.status,
        score: a.score
    }));

    return (
        <MainLayout>
            <ArtifactsBrowser initialArtifacts={formattedArtifacts} />
        </MainLayout>
    );
}
