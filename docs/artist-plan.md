# Shimokitan Entity Routing Plan

## 1. The Core Problem
The application uses a unified `entities` table in the database to represent various actors:
- **Individuals** (e.g., Kenshi Yonezu -> Solo Artist)
- **Circles** (e.g., Supercell -> Group)
- **Organizations** (e.g., MAPPA -> Anime Studio)
- **Agencies** (e.g., Hololive -> VTuber Agency)

Currently, the Next.js frontend routes *all* entities through the `/artists/@[slug]` URL path. 

**The Tension:**
1. **The Premium Linktree Use Case:** Individual artists and circles strongly benefit from a URL like `shimokitan.live/artist/@KenshiYonezu`. It feels premium, personal, and authoritative for sharing in social bios.
2. **The Semantic Incongruity:** Pointing users to `shimokitan.live/artist/@MAPPA` to view an anime studio's profile is semantically incorrect and confusing in the context of anime production credits.

## 2. The Solution: Smart Alias Routing
Instead of separating the database schema (which introduces massive complexities for unified searches, credit associations, and DRY violations since 95% of the metadata is identical), we will employ **Smart Alias Routing** at the Next.js framework level.

The database remains a single source of truth (`entities`). The frontend provides semantic "lenses" into that data based on the entity's type.

### Target Routing Architecture
1. `/artist/@[slug]` -> For `individual`, `circle`
2. `/studio/@[slug]` -> For `organization` (e.g., Anime Studios)
3. `/agency/@[slug]` -> For `agency` (e.g., VTuber Agencies)

---

## 3. Implementation Steps

### Phase 1: Establish the Shared UI Component
Currently, the entire page logic for viewing an entity lives in `app/[locale]/(main)/artists/[slug]/page.tsx`.
- **Action:** Extract this logic into a shared, reusable component (e.g., `components/entities/EntityProfileTerminal.tsx`).
- **Goal:** Drive the UI for all entity variants from a single source of truth to avoid code duplication across route handlers.

### Phase 2: Create the Next.js Route Aliases
We will construct parallel route structures that render the `EntityProfileTerminal`:
- **Action 1:** Clean up the existing nested `/artists` and `/artist` directory mess.
- **Action 2:** Establish `app/[locale]/(main)/artist/[slug]/page.tsx`
- **Action 3:** Establish `app/[locale]/(main)/studio/[slug]/page.tsx`
- **Action 4:** Establish `app/[locale]/(main)/agency/[slug]/page.tsx`
- **Behavior:** All three route layers will query `getEntityBySlug(slug)`, hydrate the translations, and pass the data to `EntityProfileTerminal`.

### Phase 3: Implement the Smart Linker Utility
Throughout the application (e.g., the Artifact page credits, Home feed), we currently hardcode links to `/artists/@${entity.slug}`. This needs to be dynamic.
- **Action:** Create a utility function `getEntityUrl(entity)`:
```typescript
export function getEntityUrl(entity: { type: string, slug: string }): string {
    if (entity.type === 'organization') return `/studio/@${entity.slug}`;
    if (entity.type === 'agency') return `/agency/@${entity.slug}`;
    return `/artist/@${entity.slug}`; // Fallback & Default for individuals/circles
}
```
- **Action:** Search and replace all hardcoded `/artists/@` routes with a call to `getEntityUrl()`.

### Phase 4: Handle Legacy Redirects and Polish
- **Action:** Update the main `/artists` directory (the grid browser) to utilize the new singular `/artist` paths when linking to individuals.
- **Action:** Ensure any static Next.js config or middleware properly accommodates the new route namespaces (`/artist`, `/studio`, `/agency`).

---

## 4. Why this Architecture Wins
* **Maintains DB Integrity:** One table means one `artifact_credits` relationship. No polymorphic nightmares. Unified search works without complex `UNION` SQL commands.
* **Creator-Centric UX:** Individual creators get the premium `shimokitan.live/artist/@handle` vanity URL.
* **Accurate Anime Context:** Anime fans navigating credits are accurately taken to `/studio/@handle` or `/agency/@handle`.
* **DRY UI:** A single React component handles the presentation layer for all actor types.
