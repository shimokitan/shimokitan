import { getDb, schema as dbSchema, eq, sql } from "./index";
import { nanoid } from "nanoid";

async function migrate() {
    const db = getDb();
    if (!db) {
        console.error("DB connection failed");
        process.exit(1);
    }

    console.log("Starting migration of 8 artifacts to works...");

    const mappings = [
        { id: "SdSqg1h-QaIwYhUDs7MON", workTitle: "BOCCHI THE ROCK!", slug: "bocchi-the-rock", category: "anime" },
        { id: "BXcc9d9VEKsXFOBRvw0rE", workTitle: "The Vexations of a Shut-In Vampire Princess", slug: "vampire-princess", category: "anime" },
        { id: "_RGyTuONRIyLQG9sg8jts", workTitle: "魔法使いエバ", slug: "magical-girl-eba", category: "music" },
        { id: "cJm8m-BD_0ho-K1nmt_rm", workTitle: "Takopi's Original Sin", slug: "takopi", category: "anime" },
        { id: "M9g8_OUo-IlxElHvbAGE3", workTitle: "Secrets of the Silent Witch", slug: "silent-witch", category: "anime" },
        { id: "8JePjyVTwuttPFEGX8HtL", workTitle: "The Arrival of Spring", slug: "arrival-of-spring", category: "music" },
        { id: "F4JIGZiQkwUkqDBQsaVfJ", workTitle: "Genshin Impact", slug: "genshin-impact", category: "game" },
        { id: "lwvxB9uIn3my_Cj6Imbyj", workTitle: "Frieren: Beyond Journey’s End", slug: "frieren", category: "anime" },
    ];

    for (const mapping of mappings) {
        console.log(`Processing artifact: ${mapping.workTitle}...`);

        // Check if work already exists (by slug)
        let work = await db.query.works.findFirst({
            where: eq(dbSchema.works.slug, mapping.slug)
        });

        if (!work) {
            const workId = nanoid();
            console.log(`Creating new work: ${mapping.workTitle} (ID: ${workId})`);
            
            await db.insert(dbSchema.works).values({
                id: workId,
                slug: mapping.slug,
                category: mapping.category as any,
            });

            await db.insert(dbSchema.worksI18n).values({
                workId: workId,
                locale: "en",
                title: mapping.workTitle,
            });

            work = { id: workId } as any;
        }

        console.log(`Updating artifact ${mapping.id} with workId ${work!.id}`);
        await db.update(dbSchema.artifacts)
            .set({ workId: work!.id })
            .where(eq(dbSchema.artifacts.id, mapping.id));
    }

    console.log("Migration completed successfully.");
    process.exit(0);
}

migrate().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
