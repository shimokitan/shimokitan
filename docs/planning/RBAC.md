# Role-Based Access Control (RBAC) Plan - Shimokitan District

## 1. Objective
To transition the current simulated "Pedalboard" experience into a production-ready, secure environment where access to specific tools (Workbench, Registry) is strictly controlled by a user's verified identity and tier.

---

## 2. Identity Tiers (The "Signal" Hierarchy)

| Role | Alias | Permissions | Access Level |
| :--- | :--- | :--- | :--- |
| **GHOST** | Visitor | View public profiles/artifacts. | Level 0 |
| **RESIDENT** | Citizen | **Social Focus:** Bio, Activity Feed, Collections, Reading Room. | Level 1 |
| **ARCHITECT** | Artist | **Professional Focus:** Resident features + **Artist Portfolio (Linktree)** + Workbench. | Level 2 |
| **FOUNDER** | Mayor | Global Registry access, verify Residents, system configuration. | Level 3 |

---

## 3. Database Strategy (Persistence)

### Auth Layer: `neon_auth` Schema
- Managed by **Neon Auth** (built on Better Auth).
- Handles OAuth (Google), Sessions, and JWTs.

### Application Layer: `public.users`
*Enhanced to sync with Neon Auth*
- `id`: Matches the `user.id` from `neon_auth`.
- `role`: Enum (`founder`, `architect`, `resident`, `ghost`).
- `entityId`: Link to their public persona (e.g. Artist profile).

### New Requirement: `verification_registry`
- Track the Resident -> Architect promotion queue.
- Statuses: `PENDING`, `APPROVED`, `REJECTED`, `REVOKED`.

---

## 4. Rendering & Mutation Strategy (The "Hardware" Implementation)

### Server-Component Rendering (The "What")
- **Instant Privilege Checks:** All role-based rendering happens in **React Server Components (RSC)**.
- **Security:** Professional portfolio tools (Linktree) and Workbench code are never shipped to a base Resident.
- **Mode Switching:** Leverages `searchParams` (`?mode=workbench`) to trigger server-side re-renders.

### Server-Action Mutations (The "How")
- **Promotions:** Moving a Resident to Architect is handled via **Server Actions**.
- **Portfolio Management:** Artists manage their Linktree/Portfolio via restricted **Server Actions**.
- **Validation:** All inputs are validated server-side using `zod`.

---

## 5. Implementation Workflow

### Phase 1: Authentication & Integration
- **Tool:** **Neon Auth** (Native Integration).
- **Goal:** Replace simulated `currentRole` with real authenticated session data.
- **Action:** 
    - Provision Neon Auth for the `shimokitan` project.
    - Set up the Better Auth client in `apps/main`.
    - Create a Sync Hook: `neon_auth.user` -> `public.users`.

### Phase 2: Feature Isolation (Resident vs. Artist)
- **Resident Mode:** Focus purely on Social/Collection. No "Manage Links" features.
- **Artist Portfolio (Linktree):** A dedicated management interface unlocked only for **Architects**.
- **Server Logic:** Primary mode rendering logic centralized in `apps/main/src/app/[locale]/(pedalboard)/pedalboard/page.tsx`.

### Phase 3: The "Workbench" Unlock
- **Flow:**
    1. Resident submits "Request Access" via **Server Action**.
    2. Entry created in `verification_registry`.
    3. Founder reviews application.
    4. Upon approval, **Server Action** patches User role to `architect`.
    5. **Workbench** and **Artist Portfolio Tools** automatically appear.

---

## 6. Critical Success Factors
- **Neon Sync:** Reliable mirroring between Auth and Application schemas.
- **Role Scoping:** Strict separation between "Social Profile" (Resident) and "Professional Portfolio" (Artist).
- **Zero-Trust:** Ensure nested components also check `session` permissions.
