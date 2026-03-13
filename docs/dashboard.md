# SHIMOKITAN: CONSOLE

## The Problem
Currently, administrative and registry management logic is colocated within the `Pedalboard` module of `apps/main`. 
- **Persona Bloat**: The "Pedalboard" is intended to be a Resident's creative workstation, but it is currently burdened with system-wide staff tools (e.g., global artifact verification, registry auditing).
- **Data Inconsistency**: There is no formal "Anchor Point" for IPs (Games, Anime, Manga). Artifacts (PVs, tracks) are represented as a flat list, forcing users to "hack" titles (e.g., `[Series Name] > [Artifact Title]`).
- **Mixed Concerns**: Administrative features like managing Signal transmissions and global tag moderation shouldn't ship to the client-side bundle of the main consumer application.

## The Why (Rationale)
In an enterprise-grade monorepo, separation of concerns across personas is critical for scaling and security.
- **Security**: Isolating "God Mode" features into a separate application reduces the attack surface for standard user accounts.
- **Performance**: `apps/main` should be light and focused on "The Vibe." Shipping heavy admin tables and audit tools to regular residents is an unnecessary overhead.
- **Clarity**: A dedicated app allows for a tailored UX/UI (data-dense, terminal-style) that differs from the aesthetic consumer experience of the main site.

## The Goal
Establish **Dashboard** as the single source of truth for system management.
1. **IP Centralization**: Implement the "Works" registry to act as the parent anchor for all artifacts. 
2. **Unified Management**: Centralize the handling of:
   - **Registry**: Verification of entities, auditing of artifacts, and IP/Work definition.
   - **Signal**: Editorial scheduling, issue tracking, and transmission broadcasting.
   - **Infrastructure**: Hosting rights auditing (R2) and tag taxonomy.
3. **Pedalboard Refactor**: Prune Pedalboard to be a sleek, resident-only dashboard for managing personal creations and creative output.

## The How (Implementation Strategy)
1. **Infrastructure**:
   - Create a new Next.js application at `apps/dashboard`.
   - Leverage shared workspace packages: `@shimokitan/db` for schema, `@shimokitan/ui` for the design system, and `@shimokitan/utils` for logic.
2. **Database Refactor**:
   - Introduce the `works` and `works_i18n` tables in `packages/db/src/schema.ts`.
   - Update `artifacts` to include an optional `work_id` foreign key.
3. **Migration**:
   - Move administrative components (ArtifactRegistry, EntityAudit) from `apps/main/src/app/[locale]/(pedalboard)` to the new app.
   - Develop the "Signal Desk" within Dashboard to handle all `transmissions` updates.
4. **Pedalboard Transformation**:
   - Redesign the user dashboard to focus on "Stompbox" modules (My Projects, My Feed, My Resonance) rather than system management.
