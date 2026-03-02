# MEDIA SIGNAL CHAIN REFINEMENT: R2 MIRRORING PLAN

Currently, the system is defaulting to **hotlinking** external media (e.g., `unavatar.io`) instead of successfully mirroring them to our internal R2 storage (`cdn.shimokitan.live`). This document outlines the plan to stabilize the media signal chain and ensure zero dependency on external availability.

## 1. THE PROBLEM
*   **Hotlink Leaks**: The system currently defaults to hotlinking external media when R2 mirroring fails. This creates dependency on external availability and inconsistent asset management.
*   **Infrastructure Mismatch**: The current implementation assumes a production-like environment with bucket access.
*   **Missing Optimization**: While the documentation mentions **Grain & Grit (Sharp)** optimization, the actual implementation directly passes the fetched buffer without processing.

## 2. ARCHITECTURAL DECISIONS

### 2.1 "Mirror-or-Bust" Policy
We are moving to a strict zero-hotlink architecture.
1.  **Strict Persistence**: All external URLs MUST be mirrored to R2. If the mirror fails, the entire operation (Entity creation/update) MUST fail.
2.  **No Fallback**: We no longer store external URLs in the Neon database for `avatar_url` or `cover_image`. The database should only contain `cdn.shimokitan.live` paths or be null.
3.  **Signal Trap**: If local storage is unavailable, the system must bubble up a critical error to the UI.
4.  **Processing**: Apply the **Grain & Grit** filter (Sharp) during upload to maintain the visual language.

### 2.2 Local Development Support
To fix the `undefined` binding issue during local development:
*   **Wrangler State**: Use `wrangler dev` to provide local R2 emulation.
*   **S3 Fallback**: (Optional) Allow `S3_COMPATIBLE_ENDPOINT` for local Minio instances if Wrangler isn't used.

## 3. IMPLEMENTATION PHASES

### Phase 1: Infrastructure Stabilization
- [ ] Implement strict error rejection in `actions.ts`: mirror failure must stop DB commit.
- [ ] Update `src/lib/r2.ts` to detect environment and provide better error messages when `MY_BUCKET` is missing.
- [ ] Update `wrangler.toml` or `.dev.vars` to ensure local R2 persistence is active.

### Phase 2: Signal Processing (Sharp)
- [ ] Implement `processImage(buffer)` within `uploadImageFromUrl`.
- [ ] Enforce **WebP** conversion and quality reduction (80) to maintain performance.
- [ ] Apply "Shimmery Grain" filters to match the District aesthetic.

### Phase 3: Global Audit & Migration
- [ ] Create a "Mirroring Maintenance" action for Founders.
- [ ] script to scan `entities.avatar_url`, `artifacts.cover_image`, and `collections.cover_image`.
- [ ] Batch upload any hotlinked URLs to R2 and update the database record.

## 4. CRITICAL FAILURE POINTS
*   **CORS**: External services (like `unavatar.io`) might block server-side fetches if they detect a scraper (though `unavatar` is usually permissive).
*   **R2 Persistence**: If local Wrangler state is wiped, local dev will show broken images unless connected to a persistent local bucket.
*   **Neon sync**: Database URLs must be updated atomically with the R2 upload to prevent "broken signals."

## 5. SUCCESS METRICS
- `entities` table has 0 records with non-`cdn.shimokitan.live` avatar URLs.
- Images load from `cdn.shimokitan.live` with `content-type: image/webp`.
- Local dev console clearly logs `[R2] MIRROR_SUCCESS` or a detailed error explaining the missing binding.
