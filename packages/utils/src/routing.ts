export function getEntityUrl(entity: { type: string, slug: string }): string {
    if (entity.type === 'organization') return `/studio/@${entity.slug}`;
    if (entity.type === 'agency') return `/agency/@${entity.slug}`;
    return `/artist/@${entity.slug}`; // Fallback & Default for individuals/circles
}
