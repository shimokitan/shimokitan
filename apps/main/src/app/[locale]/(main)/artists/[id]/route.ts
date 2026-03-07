import { NextResponse } from 'next/server';
import { getDb, schema, eq } from '@shimokitan/db';
import { getEntityUrl } from '@shimokitan/utils';

export async function GET(request: Request, props: { params: Promise<{ locale: string, id: string }> }) {
    const { locale, id } = await props.params;

    // Support either vanity slugs or raw UUIDs based on the legacy structure
    let dbId = id;
    if (id.startsWith('%40') || id.startsWith('@')) {
        dbId = decodeURIComponent(id).substring(1); // remove @
    }

    const db = getDb();
    if (!db) return new NextResponse('DB Connection Error', { status: 500 });

    try {
        // Find entity by either UUID (if valid UUID) or Slug.
        // It's safer to just search by both using an OR condition.
        const isUuid = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(dbId);

        let entity = null;
        if (isUuid) {
            entity = await db.query.entities.findFirst({
                where: eq(schema.entities.id, dbId)
            });
        } else {
            entity = await db.query.entities.findFirst({
                where: eq(schema.entities.slug, dbId)
            });
        }

        if (!entity) {
            return NextResponse.redirect(new URL(`/${locale}/artists`, request.url));
        }

        const newPath = `/${locale}${getEntityUrl(entity)}`;
        return NextResponse.redirect(new URL(newPath, request.url));
    } catch (e) {
        return NextResponse.redirect(new URL(`/${locale}/artists`, request.url));
    }
}
