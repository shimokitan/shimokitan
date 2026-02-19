
import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { getDb, schema, desc, eq, isNull, sql } from '@shimokitan/db';
import HomeClient from './HomeClient';
import { Locale, getDictionary } from '@shimokitan/utils';

export default async function AppPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const db = getDb();

  if (!db) {
    console.warn("Database initialization failed - db is null");
    return <div>DB_CONNECTION_ERROR</div>;
  }


  try {
    const testQuery = await db.execute(sql`SELECT 1`);

  } catch (e: any) {
    console.error("Diagnostic SQL check failed:", e.message);
  }

  // 1. Fetch Spotlight Artifacts (Highest Score)
  let spotlightArtifacts: any[] = [];
  try {
    const rawArtifacts = await db.query.artifacts.findMany({
      where: isNull(schema.artifacts.deletedAt),
      limit: 12, // Fetch more to allow in-memory sorting
      with: {
        translations: true
      }
    });

    // Map translations and sort by score manually
    spotlightArtifacts = rawArtifacts.map((a: any) => ({
      ...a,
      title: a.translations?.[0]?.title || "Untitled",
      description: a.translations?.[0]?.description || ""
    }))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 6);


  } catch (e: any) {
    console.error("Spotlight Fetch Failed:", e.message);
  }

  // 2. Fetch Recent Zines + their related artifacts
  let recentZines: any[] = [];
  try {
    const rawZines = await db.query.zines.findMany({
      where: isNull(schema.zines.deletedAt),
      limit: 6,
      orderBy: [desc(schema.zines.createdAt)],
      with: {
        artifact: {
          with: {
            translations: true
          }
        },
        translations: true,
        author: true
      }
    });

    recentZines = rawZines.map((z: any) => ({
      ...z,
      content: z.translations?.[0]?.content || "",
      author: z.author?.name || "Anonymous",
      artifact: z.artifact ? {
        ...z.artifact,
        title: z.artifact.translations?.[0]?.title || "Untitled",
        description: z.artifact.translations?.[0]?.description || ""
      } : null
    }));

  } catch (e: any) {
    console.error("Zines Fetch Failed:", e.message);
  }

  // 3. Featured Artifact (The one in "The Pit")
  let featuredArtifact = null;
  try {
    const rawFeatured = await db.query.artifacts.findFirst({
      where: eq(schema.artifacts.status, 'the_pit'),
      orderBy: [desc(schema.artifacts.createdAt)],
      with: {
        translations: true
      }
    });

    if (rawFeatured) {
      featuredArtifact = {
        ...rawFeatured,
        title: rawFeatured.translations?.[0]?.title || "Untitled",
        description: rawFeatured.translations?.[0]?.description || ""
      };
    }

  } catch (e: any) {
    console.error("Featured Fetch Failed:", e.message);
  }

  // 4. Fetch Entities (Lifeforms)
  let entities: any[] = [];
  try {
    const rawEntities = await db.query.entities.findMany({
      where: isNull(schema.entities.deletedAt),
      limit: 10,
      with: {
        translations: true
      }
    });

    entities = rawEntities.map((e: any) => ({
      id: e.id,
      name: e.translations?.[0]?.name || "Anonymous Resident",
      type: e.circuit === 'major' ? "Major_Circuit" : "Underground_Echo",
      uid: e.uid || `UX_${e.id.slice(0, 4).toUpperCase()}`,
      avatar: e.avatarUrl || "https://images.unsplash.com/photo-1514525253361-9f7a83707e4d?w=400&q=80",
      highlights: [] // We could fetch credits here if needed
    }));

  } catch (e: any) {
    console.error("Entities Fetch Failed:", e.message);
  }

  return (
    <MainLayout>
      <HomeClient
        spotlightArtifacts={spotlightArtifacts}
        recentZines={recentZines}
        featuredArtifact={featuredArtifact}
        entities={entities}
        dict={dict}
      />
    </MainLayout>
  );
}