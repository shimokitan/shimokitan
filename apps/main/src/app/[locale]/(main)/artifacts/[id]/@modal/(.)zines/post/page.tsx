
import React from 'react';
import { getArtifactById } from '@shimokitan/db';
import { notFound } from 'next/navigation';
import ZineModalDispatcher from '@/components/zines/ZineModalDispatcher';

export default async function InterceptedZinePostPage(props: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await props.params;
    const artifact = await getArtifactById(id);

    if (!artifact) {
        notFound();
    }

    const title = artifact.translations?.find((t: any) => t.locale === locale)?.title || 
                  artifact.translations?.[0]?.title || 
                  "Untitled_Fragment";

    return (
        <ZineModalDispatcher artifactId={id} artifactTitle={title} />
    );
}
