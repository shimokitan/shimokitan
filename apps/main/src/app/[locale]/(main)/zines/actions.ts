
'use server';

import { getDb, schema, eq, sql } from '@shimokitan/db';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { zineSchema } from '@/lib/validations/pedalboard';
import { ensureUserSync } from '../../(pedalboard)/pedalboard/auth-helpers';

/**
 * Public action for residents to broadcast echoes (zines).
 */
export async function broadcastZineAction(data: { artifactId: string; content: string }) {
    const user = await ensureUserSync();
    if (!user) throw new Error('Unauthorized_Signal: Identity_Lost');

    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const zineId = nanoid();
    const initialResonance = (user as any).resonanceMultiplier || 0;

    await db.transaction(async (tx) => {
        await tx.insert(schema.zines).values({
            id: zineId,
            artifactId: data.artifactId,
            authorId: user.id,
            resonance: initialResonance,
        });

        await tx.insert(schema.zinesI18n).values({
            zineId,
            locale: 'en',
            content: data.content,
        });

        // Update technical artifact resonance - collective weight
        if (initialResonance > 0) {
            await tx.update(schema.artifacts)
                .set({ resonance: sql`${schema.artifacts.resonance} + ${initialResonance}` })
                .where(eq(schema.artifacts.id, data.artifactId));
        }
    });

    revalidatePath(`/[locale]/artifacts/${data.artifactId}`, 'page');
    revalidatePath(`/[locale]/artifacts`, 'page');
    revalidatePath(`/[locale]`, 'layout');
    revalidatePath(`/[locale]/artifacts/${data.artifactId}/zines`, 'page');
    
    return { success: true, id: zineId };
}
