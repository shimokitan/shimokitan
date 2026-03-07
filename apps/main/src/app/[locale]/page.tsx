import React from "react";
import { MainLayout } from "../../components/layout/MainLayout";
import { getDb, schema, desc, eq, isNull, sql, and } from "@shimokitan/db";
import HomeClient from "./HomeClient";
import { Locale, getDictionary } from "@shimokitan/utils";

export const dynamic = "force-dynamic";

export default async function AppPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const db = getDb();

  if (!db) {
    if (process.env.NODE_ENV !== "production")
      console.warn("Database initialization failed - db is null");
    return <div>DB_CONNECTION_ERROR</div>;
  }

  try {
    const testQuery = await db.execute(sql`SELECT 1`);
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production")
      console.error("Diagnostic SQL check failed:", e.message);
  }

  // 1. Fetch Spotlight Artifacts (Highest Score)
  let spotlightArtifacts: any[] = [];
  try {
    const rawArtifacts = await db.query.artifacts.findMany({
      where: isNull(schema.artifacts.deletedAt),
      limit: 12, // Fetch more to allow in-memory sorting
      with: {
        cover: true,
        translations: {
          where: eq(schema.artifactsI18n.locale, locale),
        },
      },
    });

    // Map translations and sort by score manually
    spotlightArtifacts = rawArtifacts
      .map((a: any) => ({
        ...a,
        title: a.translations?.[0]?.title || "Untitled",
        description: a.translations?.[0]?.description || "",
        coverImage: a.cover?.url || null,
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 6);
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production")
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
            cover: true,
            translations: {
              where: eq(schema.artifactsI18n.locale, locale),
            },
          },
        },
        translations: {
          where: eq(schema.zinesI18n.locale, locale),
        },
        author: true,
      },
    });

    recentZines = rawZines.map((z: any) => ({
      ...z,
      content: z.translations?.[0]?.content || "",
      author: z.author?.name || "Anonymous",
      artifact: z.artifact
        ? {
          ...z.artifact,
          title: z.artifact.translations?.[0]?.title || "Untitled",
          description: z.artifact.translations?.[0]?.description || "",
          coverImage: z.artifact.cover?.url || null,
        }
        : null,
    }));
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production")
      console.error("Zines Fetch Failed:", e.message);
  }

  // 3. Featured Artifact (The one in "The Pit")
  let featuredArtifact: any = null;
  try {
    const rawFeatured = await db.query.artifacts.findFirst({
      where: and(
        eq(schema.artifacts.status, "the_pit"),
        eq(schema.artifacts.category, "anime")
      ),
      orderBy: sql`RANDOM()`,
      with: {
        cover: true,
        translations: {
          where: eq(schema.artifactsI18n.locale, locale),
        },
        resources: true,
      },
    });

    if (rawFeatured) {
      let videoUrl = null;
      const primaryVideo = rawFeatured.resources?.find(
        (r: any) =>
          r.type === "video" || r.type === "mv" || r.platform === "youtube",
      );
      if (primaryVideo) {
        if (primaryVideo.value.includes("youtube.com/watch?v=")) {
          const vId = primaryVideo.value.split("v=")[1]?.split("&")[0];
          videoUrl = `https://www.youtube.com/embed/${vId}?autoplay=1&mute=1`;
        } else if (primaryVideo.value.includes("youtu.be/")) {
          const vId = primaryVideo.value.split("youtu.be/")[1]?.split("?")[0];
          videoUrl = `https://www.youtube.com/embed/${vId}?autoplay=1&mute=1`;
        } else {
          videoUrl = primaryVideo.value;
        }
      }

      featuredArtifact = {
        ...rawFeatured,
        title: rawFeatured.translations?.[0]?.title || "Untitled",
        description: rawFeatured.translations?.[0]?.description || "",
        coverImage: rawFeatured.cover?.url || null,
        videoUrl: videoUrl,
      };
    }
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production")
      console.error("Featured Fetch Failed:", e.message);
  }

  // 4. Fetch Entities (Lifeforms)
  let entities: any[] = [];
  try {
    const rawEntities = await db.query.entities.findMany({
      where: isNull(schema.entities.deletedAt),
      limit: 10,
      with: {
        avatar: true,
        translations: {
          where: eq(schema.entitiesI18n.locale, locale),
        },
      },
    });

    entities = rawEntities.map((e: any) => ({
      ...e,
      name: e.translations?.[0]?.name || "Anonymous Entity",
      type: e.circuit === "major" ? "Major_Circuit" : "Underground_Echo",
      _rawType: e.type,
      slug: e.slug,
      uid: e.uid || `UX_${e.id.slice(0, 4).toUpperCase()}`,
      avatar: e.avatar?.url || null,
      highlights: [], // We could fetch credits here if needed
    }));
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production")
      console.error("Entities Fetch Failed:", e.message);
  }

  // 5. Ambient World Data (Live Weather + DB Record Count)
  let weatherTemp = "8°C";
  try {
    // Exact coordinates for Shimokitazawa, Setagaya-ku, Tokyo
    const weatherRes = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=35.6611&longitude=139.6666&current_weather=true",
      { next: { revalidate: 1800 } },
    );
    if (weatherRes.ok) {
      const weatherData = await weatherRes.json();
      if (weatherData?.current_weather?.temperature) {
        weatherTemp = `${Math.round(weatherData.current_weather.temperature)}°C`;
      }
    }
  } catch (e) {
    if (process.env.NODE_ENV !== "production")
      console.error("Weather Sync Failed");
  }

  let totalResonance = "1.2K";
  try {
    const countRes = await db.execute(
      sql`SELECT (SELECT COUNT(*) FROM artifacts) + (SELECT COUNT(*) FROM entities) + (SELECT COUNT(*) FROM zines) as total`,
    );
    const total = Number((countRes as any)[0]?.total || 0);
    totalResonance =
      total < 1000 ? String(total) : `${(total / 1000).toFixed(1)}K`;
  } catch (e) {
    if (process.env.NODE_ENV !== "production")
      console.error("Resonance Count Failed");
  }

  return (
    <MainLayout>
      <HomeClient
        spotlightArtifacts={spotlightArtifacts}
        recentZines={recentZines}
        featuredArtifact={featuredArtifact}
        entities={entities}
        dict={dict}
        weatherTemp={weatherTemp}
        totalResonance={totalResonance}
        artifactCount={spotlightArtifacts.length}
        entityCount={entities.length}
      />
    </MainLayout>
  );
}
