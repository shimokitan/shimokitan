# Entity Hierarchy & Contribution Logic // Revised System Plan

---

## 0. What Changed From the Previous Plan

The original plan was a valid **UI and product vision** but had three structural blind spots:

1. It designed the credits system in isolation — ignoring the `users` layer entirely
2. It placed `staff` as an entity type instead of a contribution class
3. It described the destination without mapping the schema changes needed to get there

This revised plan addresses all three.

---

## 1. The Core Mental Model

Three concepts exist independently. They must not bleed into each other:

| Concept | Table | What It Represents |
|---|---|---|
| **Identity** | `users` | A person's account in the system |
| **Creative Identity** | `entities` | A public-facing name, group, or unit in the registry |
| **Contribution** | `artifact_credits` | What a creative identity did on a specific artifact |

A **User** is not automatically an **Entity**. A Resident has a user account but no entity. An Architect has both, linked via `entity_managers`. The profile type (social vs. professional) lives on the entity, not the user.

---

## 2. The Contributor Class Model

"Artist" is not a universal term for everyone in a credit. The system recognizes three contributor classes:

- **Author** — the creative origin. Vocalist, Composer, Illustrator, Animator who conceived the piece. Primary candidates for the Lead Deck.
- **Collaborator** — creative input but not the origin. Featured vocalist, co-writer, remix artist. Creative but secondary.
- **Staff** — technical execution. Mixer, Mastering Engineer, Encoder, Subtitle Editor. Skilled and essential, but their contribution is craft-in-service, not authorship.

`contributor_class` belongs on `artifact_credits`, not on the entity itself. The same person can be an Author on their own artifact and Staff on someone else's.

---

## 3. Schema Changes

### 3.1 Entities — Remove `staff` Type

`staff` is a contribution class, not an identity type. Remove it from the entity type enum.

```typescript
// BEFORE
type: text("type", { enum: ['individual', 'organization', 'agency', 'circle', 'staff'] })

// AFTER
type: text("type", { enum: ['individual', 'organization', 'agency', 'circle'] })
```

Add `profileType` to distinguish social vs. professional presentation:

```typescript
export const entities = pgTable("entities", {
    // ... existing fields ...
    profileType: text("profile_type", { enum: ['social', 'professional'] }).default('professional'),
});
```

### 3.2 Artifact Credits — Full Evolution

```typescript
export const artifactCredits = pgTable("artifact_credits", {
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }),
    entityId: text("entity_id").references(() => entities.id, { onDelete: 'cascade' }),

    // What they did (system tag, e.g. "mix", "master", "vocal", "animation")
    role: text("role").notNull(),

    // Human-readable override for display (e.g. "Original Character Design")
    displayRole: text("display_role"),

    // The contribution class — determines eligibility for Lead Deck
    contributorClass: text("contributor_class", {
        enum: ['author', 'collaborator', 'staff']
    }).default('staff').notNull(),

    // Visual toggle — determines placement within the Lead Deck
    isPrimary: boolean("is_primary").default(false),

    // Manual ordering within each zone
    position: integer("position").default(0),

}, (table) => ({
    pk: primaryKey({ columns: [table.artifactId, table.entityId, table.role] }),
}));
```

**How `contributorClass` and `isPrimary` work together:**

- `contributorClass` = eligibility. Only `author` and `collaborator` should appear in Zone A (Lead Deck). `staff` always goes to Zone B.
- `isPrimary` = placement. Among eligible entities, `isPrimary: true` gets the prominent slot. Multiple `isPrimary` entities trigger the "Collaborative Signal" layout.
- The Architect can override this — but the system defaults are based on class.

### 3.3 Zines — Fix Dangling Author Field

```typescript
// BEFORE
author: text("author").notNull(),

// AFTER
authorId: text("author_id").references(() => users.id).notNull(),
```

---

## 4. User → Entity Lifecycle

### 4.1 Role States

| User Role | Has Entity | Profile Type | Can Create Artifacts |
|---|---|---|---|
| `ghost` | No | None | No |
| `resident` | No | Social (user profile only) | No |
| `architect` | Yes | Professional (entity profile) | Yes |
| `founder` | Yes | Professional | Yes |

### 4.2 Architect Approval Flow

1. Resident submits application via `verificationRegistry` with `targetType: 'role_upgrade'`
2. Founder reviews and approves
3. On approval:
   - `users.role` updates to `'architect'`
   - A new `entities` record is created for them (`type: 'individual'`, `profileType: 'professional'`)
   - An `entityManagers` row links the user to their entity with `role: 'owner'`
4. Architect can now create artifacts and appear in credits as an entity

### 4.3 Profile Rendering Logic

```
if user.role === 'resident':
    render social profile (users table data only)
    
if user.role === 'architect' or 'founder':
    render professional profile (entity data via entityManagers link)
```

---

## 5. The Unit Pattern

For groups that form for a specific work:

1. Create a `circle` type entity for the Unit
2. Set Unit as `isPrimary: true`, `contributorClass: 'author'` in credits
3. Set individual members as `isPrimary: false`, `contributorClass: 'author'` or `'collaborator'` with their specific roles

Result: The artifact is visually owned by the Unit in Zone A. The individuals are credited in Zone B with their specific roles.

To make Unit membership structural (not implied), add:

```typescript
export const unitMembers = pgTable("unit_members", {
    unitId: text("unit_id").references(() => entities.id, { onDelete: 'cascade' }),
    memberId: text("member_id").references(() => entities.id, { onDelete: 'cascade' }),
    memberRole: text("member_role"), // their role within the unit
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
    pk: primaryKey({ columns: [table.unitId, table.memberId] }),
}));
```

This enables cross-referencing — clicking a Unit shows its members, clicking a member shows their Units.

---

## 6. UI Implementation

### 6.1 Zone A — Lead Deck

Renders entities where `contributorClass` is `author` or `collaborator` AND `isPrimary: true`.

- Single lead → prominent avatar, large name, verified badge
- Multi-lead (2–3) → smaller avatar circles, "Collaborative Signal" layout
- Only `isPrimary` entities fetch avatars in the browser grid (performance)

### 6.2 Zone B — Audit Trail

Renders all remaining credits — `isPrimary: false` entities and all `staff` class contributions.

- Dense, monospaced list
- Format: `displayRole || role` → `entity name` (text link)
- No avatar boxes reserved

### 6.3 Registry Form (The Pedalboard)

The `Contribution_Ledger` form exposes:

- Entity search/select
- `role` (system tag, dropdown)
- `displayRole` (optional free text override)
- `contributorClass` (author / collaborator / staff — sets sensible default for `isPrimary`)
- `isPrimary` toggle (⚡) — only meaningful for `author` and `collaborator` class
- `position` (drag handle for ordering)

Staff entries are "register and go" — no avatar hunting required, no `isPrimary` toggle shown.

---

## 7. Migration Checklist

- [ ] Remove `staff` from `entities.type` enum
- [ ] Add `profileType` to `entities`
- [ ] Evolve `artifactCredits` — add `displayRole`, `contributorClass`, `isPrimary`, `position`
- [ ] Audit existing entity records — re-classify any `type: 'staff'` to `type: 'individual'`
- [ ] Fix `zines.author` → `zines.authorId` foreign key
- [ ] Create `unitMembers` join table
- [ ] Update `entityManagers` relation in Drizzle relations config for new fields
- [ ] Update Architect approval flow to create entity + entityManagers on role upgrade
- [ ] Update UI rendering logic to use `contributorClass` + `isPrimary` for zone assignment

---

## 8. Decision Summary

| Decision | Rationale |
|---|---|
| `staff` removed from entity type | Staff is a contribution role, not an identity type. Same person can be staff on one artifact, author on another. |
| `contributorClass` on credits | Separates eligibility (what class you are) from placement (are you primary) |
| `displayRole` separate from `role` | `role` is a system tag for logic; `displayRole` is human-readable for UI |
| `unitMembers` table | Makes Unit composition structural, not implied. Enables cross-referencing. |
| `profileType` on entities | Decouples presentation logic from user role. Entity knows how to present itself. |
| `authorId` FK on zines | Removes dangling string reference, enables proper user → zine querying |