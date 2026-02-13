# SHIMOKITAN INFRASTRUCTURE & API STRATEGY

This document outlines the deployment architecture, service orchestration, and communication patterns for the Shimokitan District network.

## 1. COMMUNICATION PATTERN: API-FIRST

To adhere to the **Mandatory API Testing rule (Global Rule 4)**, the project follows an **API-First** strategy for all state mutations.

*   **Pattern:** Critical business logic (Zines, Quest progress, Soundchecks) must be exposed via **Next.js Route Handlers (`/api/*`)**.
*   **Verification:** Every endpoint must be reproducible via `curl`.
*   **Usage:**
    *   **Route Handlers:** Primary for data persistence and cross-district calls.
    *   **Server Actions:** Reserved for simple UI-driven state (e.g., toggling a pedal filter on the dashboard).
    *   **TanStack Query:** The primary vehicle for client-side data fetching and optimistic UI updates.

## 2. DEPLOYMENT MATRIX

| Environment | Service | Platform | Rationale |
| :--- | :--- | :--- | :--- |
| **Edge / Frontend** | Next.js Apps | Vercel | Seamless App Router support and Global CDN. |
| **Relational DB** | Business Layer | Neon | Serverless Postgres with integrated Auth. |
| **Document DB** | UGC Layer | MongoDB Atlas | Global scale for "Narrative Density" data. |
| **Object Storage** | Assets (Media) | Cloudflare R2 | Zero egress fees for high-fidelity ASMR/Audio. |
| **Caching/PubSub** | Real-time Vibe | Upstash Redis | Serverless low-latency signaling for "The Pit." |

## 3. MULTI-DISTRICT ORCHESTRATION

Shimokitan uses a **Subdomain-based** structure within a single Monorepo:

*   **Principal Apex:** `shimokitan.live`
*   **Bazaar:** `akiba.shimokitan.live`
*   **Sanctuary:** `kabukicho.shimokitan.live`

### Shared Secret Management
All districts share a common **Identity Provider (Neon Auth)**. A session cookie from the apex domain is utilized to maintain "Street Credit" across the entire ecosystem.

## 4. THE IMAGE PIPELINE (GRAIN & GRIT)

User-uploaded content is processed through an automated **Sharp** pipeline to maintain the "Intentional Mess" aesthetic:

1.  **Ingestion:** Upload via `apps/main` to Cloudflare R2.
2.  **Transformation:** A specialized Service Worker or Edge Function applies:
    *   High-grain noise filters.
    *   Nicotine-stain color grading.
    *   Resolution downscaling (for that "raw/analog" feel).
3.  **Delivery:** Served through Cloudflare for optimized delivery.

## 5. SELF-HOSTING FALLBACK (VPS)

While primarily designed for Vercel, the architecture maintains **Arch Linux compatibility** for VPS self-hosting:

*   All database interactions use standardized connection strings.
*   The Monorepo build process must remain compatible with standard `npm/pnpm` build commands on a Linux environment.
*   **Nginx** is the recommended reverse proxy for subdomain routing in a self-hosted scenario.

## 6. SECURITY & COMPLIANCE

*   **Cloudflare Challenges:** Mandatory for the Public Zine submission endpoints to prevent automated noise.
*   **Kabukicho Isolation:** Adult-rated artifacts are isolated to the `apps/kabukicho` codebase to ensure the main district remains "Safe-ish."
*   **Audit Logs:** Critical mutations (Permanent Zine commits) are logged with high-resolution timestamps in Neon.
