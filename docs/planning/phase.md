# SHIMOKITAN DEVELOPMENT PHASES

This document outlines the roadmap for the Shimokitan District ecosystem, focusing on achieving a "Vibe-First" experience while maintaining technical robustness.

## 🏁 PHASE 1: THE DISCOVERY (Core Foundation)
**Goal:** Establish the visual identity and the primary infrastructure.

*   **Infrastructure:**
    *   Monorepo initialization (Turborepo + pnpm).
    *   Shared UI package (`@shimokitan/ui`) with "Charcoal/Concrete/Nicotine" design tokens.
    *   Database setup (Neon for relational metadata, MongoDB for UGC storage).
*   **The Landing Zones:**
    *   Primary Homepage for `shimokitan.live` (The District Entrance).
    *   Stub pages for specialized districts.
*   **The Media Foundation:**
    *   Base Schema for Media Artifacts.
    *   "The Pit" vs "The Back-Alley" state logic implementation.

---

## 🖼️ PHASE 2: THE GALLERY (Artifact Architecture)
**Goal:** Define the layouts and content specific to each media type.

*   **Artifact Page Layouts:**
    *   **Anime:** Seasonal tracker with "Pit" status and episode logs.
    *   **Music / Song:** High-fidelity audio player orientation and album art focus.
    *   **ASMR:** Atmospheric "Whisper" logs with focused audio visualization.
    *   **Manga:** Page-by-page layout or archival shard view.
    *   **Doujinshi:** Specialized sanctuary view for Kabukicho-rated masterpieces.
    *   **Music Video:** Immersive YouTube loop with credits and trivia overlays.
*   **Content Decision:** Finalizing the data requirements (attributes, genres, tags) for each artifact category.

---

## 📈 PHASE 3: THE DISTRICT PULSE (Seeding & Populating)
**Goal:** Transition from mock data to a populated "District" via production seeding.

*   **Home Seeding:**
    *   Populating the "Spotlight" and "In The Pit" sections with actual Neon DB records.
    *   Transitioning homepage components from static constants to TanStack Query hooks.
*   **Initial Resonance:**
    *   Implementing the visual "Heat Index" displays on the homepage.
    *   Basic artifact search and filtering (Crate Digging v1.0).
*   **Performance:** Optimization of the hybrid data layer to ensure fast fetches for the Home district.

---

## 📓 PHASE 4: THE ALBUM ERA (UGC & Memory)
**Goal:** Implement the storytelling engine and user persistence via Zines.

*   **Identity:** Neon Auth integration and Resident Profile initialization.
*   **The Zine Engine:**
    *   Implementation of Public Zines (`/zines`) and private Perzines (`/perzines`).
    *   Artifact-centric attachment requirements and permanent submission logic.
*   **Street Stickers:** Implementation of community-applied resonance labels (`[TRUTH]`, `[GOLD]`, etc.).
*   **UGC Pipeline:**
    *   Sharp-powered image processing for grain-filtered attachments.
    *   Vocal Snippets (audio recording) for honest reactions.
*   **Gamification:** Quests and Soundchecks based on Zine activity.

---

## 🏙️ PHASE 5: THE EXTENDED DISTRICTS (Bazaar & Sanctuary)
**Goal:** Populate and polish the specialized subdomains.

*   **Akiba District (The Bazaar):** Storefront implementation and payment integration.
*   **Kabukicho District (The Sanctuary):** Audit systems and high-effort adult artistry focus.
*   **The Physical Pressing:** Backend logic for vinyl pressing rewards.
