# SHIMOKITAN DEVELOPMENT PHASES

This document outlines the roadmap for the Shimokitan District ecosystem, focusing on achieving a "Vibe-First" experience while maintaining technical robustness.

## 🏁 PHASE 1: THE DISCOVERY (Core Foundation)
**Goal:** Establish the visual identity and the primary archival database.

*   **Infrastructure:**
    *   Monorepo initialization (Turborepo + pnpm).
    *   Shared UI package (`@shimokitan/ui`) with "Charcoal/Concrete/Nicotine" design tokens.
    *   Database setup (Neon for artifacts metadata, MongoDB for future UGC).
*   **The Landing Zones:**
    *   Primary Homepage for `shimokitan.live` (The District Entrance).
    *   Stub pages for `akiba` and `kabukicho` districts.
*   **The Artifact Database:**
    *   Schema for Seasonal Anime/Media (ID, Title, Editorial Description, Status).
    *   "The Pit" vs "The Back-Alley" state logic.
*   **Gateways & Consumption:**
    *   **The Media Rack:** Integration of affiliate buttons (Crunchyroll, Apple Music).
    *   **Live House Embeds:** Official YouTube video/soundtrack embedding via Iframe.
    *   Basic artifact search/filter (Crate Digging v0.1).

---

## 📓 PHASE 2: THE ALBUM ERA (UGC & Memory)
**Goal:** Implement the storytelling engine and user persistence.

*   **Identity:** Neon Auth integration and User Profile initialization.
*   **The District Album:** Saving artifacts to personal "Completed Albums."
*   **The Zine Engine:**
    *   Implementation of Public Zines (`/zines`) and private Perzines (`/perzines`).
    *   Artifact-centric attachment requirements.
    *   Strictly permanent submission logic (permanent write in MongoDB).
*   **The Grain Pipeline:** Sharp-powered image processing for Zine attachments.
*   **Vocal Snippets:** Audio recording and storage for "The Honest Stutter."

---

## 📈 PHASE 3: THE RESONANCE (Heat & Mechanics)
**Goal:** Launch the community feedback loops and gamification.

*   **The Heat Index:** Algorithm to calculate "Narrative Density" from Zine volume and quality.
*   **Street Stickers:** Implementation of `[TRUTH]`, `[GOLD]`, `[DISTORTION]`, and `[CLEAN]` labels.
*   **Gamification:**
    *   **Quests:** Action-based milestone tracking (e.g., Seasonal Cold Quest).
    *   **Soundchecks:** Quiz-based atmospheric challenges.
    *   **Ink System:** Digital badges for "Original Pressing" and quest rewards.
*   **The Pedalboard:** Transitioning the User Dashboard to the modular Bento-style pedalboard UI.

---

## 🏙️ PHASE 4: THE EXTENDED DISTRICTS (Bazaar & Sanctuary)
**Goal:** Populate and polish the specialized subdomains.

*   **Akiba District (The Bazaar):**
    *   Storefront implementation for curated gear and artifacts.
    *   Payment integration (Stripe/alternative).
    *   "Street Credit" gating for exclusive items.
*   **Kabukicho District (The Sanctuary):**
    *   Audit systems for high-effort adult artistry.
    *   Dedicated gallery and player for masterpieces.
*   **The Physical Pressing:** Backend logic for identifying top musicians for vinyl pressing.
*   **The Performance Audit:** Final optimization and polish for "Safe-ish" isolation between districts.
