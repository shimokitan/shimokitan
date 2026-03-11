
import { getDb, schema } from './index';
import { nanoid } from 'nanoid';

async function seedTransmissions() {
    const db = getDb();
    if (!db) return;

    const rouId = "00000000-0000-0000-0000-000000000001";

    console.log(`--- SEEDING TRANSMISSIONS ---`);

    try {
        await db.transaction(async (tx) => {
            // 1. First Post: Hello Residents
            await tx.insert(schema.transmissions).values({
                id: `SIG-${nanoid(6).toUpperCase()}`,
                type: 'editorial',
                title: 'Hello Residents, welcome to the district',
                topic: 'Why Shimokitan ban AI Art while using AI Assistant as coding foundation',
                content: `Welcome to the District. \n\nWe are building a future where human creativity is augmented, not replaced. Shimokitan stands as a testament to this philosophy. We use AI as a high-performance foundation for our systems, while preserving the sacred nature of visual arts for human hands.`,
                authorId: rouId,
                severity: 'monitoring',
                isActive: true,
                publishedAt: new Date(),
            });

            // 2. A real technical issue
            await tx.insert(schema.transmissions).values({
                id: 'SIG-CORE-01',
                type: 'issue',
                title: 'API Latency Degradation in Core Services',
                topic: 'Latency Audit',
                content: 'Significant latency observed across all routes accessing the core database, leading to timeouts in user-facing applications.',
                authorId: rouId,
                severity: 'critical',
                affectedUsers: 14200,
                isActive: true,
                publishedAt: new Date(),
            });
        });

        console.log('SUCCESS: Transmissions seeded.');

    } catch (e: any) {
        console.error('SEEDING_FAILED:', e.message);
    }
}

seedTransmissions().catch(console.error);
