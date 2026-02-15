import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { getDb, schema, desc, eq } from '@shimokitan/db';
import HomeClient from './HomeClient';

export default async function AppPage() {
  const db = getDb();
  if (!db) return <div>DB_CONNECTION_ERROR</div>;

  // 1. Fetch Spotlight Artifacts (Highest Score)
  const spotlightArtifacts = await db.query.artifacts.findMany({
    limit: 6,
    orderBy: [desc(schema.artifacts.score)],
  });

  // 2. Fetch Recent Zines + their related artifacts
  const recentZines = await db.query.zines.findMany({
    limit: 6,
    orderBy: [desc(schema.zines.createdAt)],
    with: {
      artifact: true
    }
  });

  // 3. Featured Artifact (The one in "The Pit")
  const featuredArtifact = await db.query.artifacts.findFirst({
    where: eq(schema.artifacts.status, 'the_pit'),
    orderBy: [desc(schema.artifacts.createdAt)],
  });

  return (
    <MainLayout>
      <HomeClient
        spotlightArtifacts={spotlightArtifacts as any}
        recentZines={recentZines as any}
        featuredArtifact={featuredArtifact as any}
      />
    </MainLayout>
  );
}