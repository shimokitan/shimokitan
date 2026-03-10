export function getEntityUrl(entity: { type: string, slug: string }): string {
    // All entities (individual creators, agencies, studios) now live at the root namespace
    // for shorter, cleaner "Linktree replacement" URLs.
    return `/${entity.slug}`;
}


