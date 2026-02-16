
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

  console.log("AppPage: DB Initialized and ready for query");
  try {
    const testQuery = await db.execute(sql`SELECT 1`);
    console.log("Diagnostic SQL check:", testQuery);
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

    console.log(`AppPage: Fetched ${spotlightArtifacts.length} spotlight artifacts`);
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
        translations: true
      }
    });

    recentZines = rawZines.map((z: any) => ({
      ...z,
      content: z.translations?.[0]?.content || "",
      artifact: z.artifact ? {
        ...z.artifact,
        title: z.artifact.translations?.[0]?.title || "Untitled",
        description: z.artifact.translations?.[0]?.description || ""
      } : null
    }));
    console.log(`AppPage: Fetched ${recentZines.length} recent zines`);
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
    console.log("AppPage: Featured artifact fetch complete");
  } catch (e: any) {
    console.error("Featured Fetch Failed:", e.message);
  }

  return (
    <MainLayout>
      <HomeClient
        spotlightArtifacts={spotlightArtifacts}
        recentZines={recentZines}
        featuredArtifact={featuredArtifact}
        dict={dict}
      />
    </MainLayout>
  );
}