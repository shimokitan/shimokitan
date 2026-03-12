import React from "react";
import { MainLayout } from "../../components/layout/MainLayout";
import { getDb, schema, desc, eq, isNull, sql, and, resolveTranslation } from "@shimokitan/db";
import HomeClient from "./HomeClient";
import { Locale, getDictionary } from "@shimokitan/utils";

import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.home.title,
    description: dict.home.description,
  };
}

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
        thumbnail: true,
        poster: true,
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
        thumbnailImage: a.thumbnail?.url || null,
        posterImage: a.poster?.url || null,
      }))
      .sort((a, b) => (b.resonance || 0) - (a.resonance || 0))
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
            thumbnail: true,
            poster: true,
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
          thumbnailImage: z.artifact.thumbnail?.url || null,
          posterImage: z.artifact.poster?.url || null,
        }
        : null,
    }));
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production")
      console.error("Zines Fetch Failed:", e.message);
  }

  // 3. Featured Artifacts (The ones in "The Pit")
  let featuredArtifact: any = null;
  let videoArtifact: any = null;
  try {
    const rawPitArtifacts = await db.query.artifacts.findMany({
      where: and(
        eq(schema.artifacts.status, "the_pit"),
        sql`${schema.artifacts.category} IN ('anime', 'music')`
      ),
      orderBy: sql`RANDOM()`,
      limit: 10,
      with: {
        thumbnail: true,
        poster: true,
        translations: {
          where: eq(schema.artifactsI18n.locale, locale),
        },
        resources: true,
      },
    });

    const processArtifact = (raw: any) => {
      let videoUrl = null;
      const primaryVideo = raw.resources?.find(
        (r: any) =>
          r.role === "embed_video" ||
          r.role === "stream" ||
          r.platform === "youtube",
      );
      if (primaryVideo) {
        if (primaryVideo.value.includes("youtube.com/watch?v=")) {
          const vId = primaryVideo.value.split("v=")[1]?.split("&")[0];
          videoUrl = `https://www.youtube.com/embed/${vId}`;
        } else if (primaryVideo.value.includes("youtu.be/")) {
          const vId = primaryVideo.value.split("youtu.be/")[1]?.split("?")[0];
          videoUrl = `https://www.youtube.com/embed/${vId}`;
        } else if (primaryVideo.platform === 'youtube' && !primaryVideo.value.includes('/')) {
          videoUrl = `https://www.youtube.com/embed/${primaryVideo.value}`;
        } else {
          videoUrl = primaryVideo.value;
        }
      }

      return {
        ...raw,
        title: raw.translations?.[0]?.title || "Untitled",
        description: raw.translations?.[0]?.description || "",
        thumbnailImage: raw.thumbnail?.url || null,
        posterImage: raw.poster?.url || null,
        videoUrl: videoUrl,
      };
    };

    if (rawPitArtifacts.length > 0) {
      // Pick the first one for the "In The Pit" card
      featuredArtifact = processArtifact(rawPitArtifacts[0]);

      // Pick a different one for the "Video" card, ideally one with a videoUrl
      const artifactsWithVideo = rawPitArtifacts.filter((a, idx) => {
        if (idx === 0) return false; // Don't pick the same one
        return a.resources?.some(r => r.role === "embed_video" || r.platform === "youtube");
      });

      if (artifactsWithVideo.length > 0) {
        videoArtifact = processArtifact(artifactsWithVideo[0]);
      } else if (rawPitArtifacts.length > 1) {
        videoArtifact = processArtifact(rawPitArtifacts[1]);
      } else {
        // Fallback: if only one exists, they stay the same or we leave videoArtifact null
        videoArtifact = featuredArtifact;
      }
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
      type: e.type?.toUpperCase() || "INDEPENDENT",
      _rawType: e.type,
      slug: e.slug,
      uid: e.uid || `UX_${e.id.slice(0, 4).toUpperCase()}`,
      professionalTitle: e.translations?.[0]?.status || (e.type === 'independent' ? 'Resident' : e.type?.toUpperCase() || "Resident"),
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

  let totalResonance = "0";
  try {
    const resSum = await db.execute(
      sql`SELECT (SELECT COALESCE(SUM(resonance), 0) FROM artifacts) + (SELECT COALESCE(SUM(resonance), 0) FROM zines) as total`,
    );
    const total = Number((resSum as any)[0]?.total || 0);
    totalResonance =
      total < 1000 ? String(total) : `${(total / 1000).toFixed(1)}K`;
  } catch (e) {
    if (process.env.NODE_ENV !== "production")
      console.error("Resonance Count Failed");
  }

  // 6. Fetch Latest Hosted Track for Audio Widget
  let currentTrack: any = null;
  try {
    const latestHosted = await db.query.artifacts.findFirst({
      where: and(
        eq(schema.artifacts.isHosted, true),
        eq(schema.artifacts.category, 'music'),
        isNull(schema.artifacts.deletedAt)
      ),
      orderBy: [desc(schema.artifacts.createdAt)],
      with: {
        thumbnail: true,
        translations: {
          where: eq(schema.artifactsI18n.locale, locale),
        },
        resources: true,
        credits: {
          with: {
            entity: {
              with: {
                translations: {
                  where: eq(schema.entitiesI18n.locale, locale)
                }
              }
            }
          }
        }
      }
    });

    if (latestHosted) {
      const audioRes = latestHosted.resources?.find(r => r.role === 'hosted_audio');
      const artistNames = (latestHosted as any).credits
        ?.filter((c: any) => c.isPrimary)
        .map((c: any) => c.entity?.translations?.[0]?.name || c.entity?.name)
        .filter(Boolean)
        .join(", ") || "Unknown Artist";

      currentTrack = {
        title: latestHosted.translations?.[0]?.title || "Untitled",
        artist: artistNames,
        album: latestHosted.translations?.[0]?.description?.slice(0, 50) || "Single",
        cover: latestHosted.thumbnail?.url || "https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png",
        bitrate: "1411 KBPS",
        format: (audioRes as any)?.value?.endsWith('.m3u8') ? "HLS" : "LOSSLESS",
        src: (audioRes as any)?.value || ""
      };
    }
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production")
      console.error("Hosted track fetch failed:", e.message);
  }

  // 7. Fetch Transmissions (Signal Feed)
  let transmissions: any[] = [];
  try {
    const rawTransmissions = await db.query.transmissions.findMany({
      where: eq(schema.transmissions.isActive, true),
      orderBy: [desc(schema.transmissions.publishedAt)],
      limit: 5,
      with: {
        translations: true
      }
    });

    transmissions = rawTransmissions.map(t => {
      const trans = resolveTranslation(t.translations, locale);
      return {
        ...t,
        title: trans?.title || "Untitled Transmission",
        content: trans?.content || ""
      }
    });
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production")
      console.error("Transmissions Fetch Failed:", e.message);
  }

  return (
    <MainLayout>
      <HomeClient
        spotlightArtifacts={spotlightArtifacts}
        recentZines={recentZines}
        featuredArtifact={featuredArtifact}
        videoArtifact={videoArtifact}
        entities={entities}
        dict={dict}
        weatherTemp={weatherTemp}
        totalResonance={totalResonance}
        transmissions={transmissions}
        artifactCount={spotlightArtifacts.length}
        entityCount={entities.length}
        currentTrack={currentTrack}
      />
    </MainLayout>
  );
}
