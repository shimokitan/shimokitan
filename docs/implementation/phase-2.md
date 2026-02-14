# PHASE 2 IMPLEMENTATION: THE GALLERY (ARTIFACT ARCHITECTURE)

This document details the technical and design specifications for the Artifact pages in the Shimokitan District, as defined in the roadmap.

## 1. THE NAMING CONVENTION
*   **Primary Entity:** `Artifact`
*   **Action:** Consulting the Shards (The act of viewing metadata/Zines).
*   **Goal:** Provide a high-fidelity, immersive identity for every piece of media while maintaining clear relational links.

## 2. MODULAR DATA ARCHITECTURE (NEON/POSTGRES)

To handle the diversity between Anime (Studios) and Music (Artists), we will implement a "Base + Extension" pattern.

### Base Artifact Schema (`artifacts`)
*   `id`: UUID
*   `title`: Text
*   `slug`: Text (unique)
*   `category`: Enum (anime, music, asmr, manga, doujinshi, mv)
*   `editorial_description`: Text (The vibe-first summary)
*   `cover_image_url`: Text
*   `heat_index`: Int (calculated resonance)
*   `status`: Enum (the_pit, back_alley)

### Extension Schemas
*   **`artifact_anime`**: `studio_id`, `season`, `year`, `episode_count`, `mal_id`.
*   **`artifact_music`**: `artist_name`, `label`, `bpm`, `mood_tags`, `apple_music_id`.
*   **`artifact_reading`**: `author_name`, `chapter_count`, `is_adult` (Kabukicho gated).

## 3. THE "PEDALBOARD" UI FRAMEWORK

Every Artifact page (`/artifacts/[slug]`) utilizes a deconstructed modular shell.

### Layout Sections:
1.  **Header (The Masking Tape):**
    *   Sticky label with monospaced metadata: `TYPE: [CAT] // STATUS: [STATE] // RES: [INDEX]`.
    *   Visual style: Distorted paper / Masking tape overlay.

2.  **Side A: The Media Deck (Main - 60% Width):**
    *   **Anime/MV:** Immersive Video Embed with "Grain" overlay.
    *   **Music/ASMR:** The "Black Vinyl Disk" – a rotating record visualizer with reacting waveforms.
    *   **Manga/Douj:** The "Zine Reader" – a vertical high-contrast canvas with paper textures.

3.  **Side B: The Controls (Sidebar - 40% Width):**
    *   Modular "Pedal" Widgets (shadcn/ui cards with metallic/industrial styling).
    *   **Credits Pedal:** Artist/Studio details.
    *   **Gateways Pedal:** Branding-consistent buttons for Crunchyroll, Apple Music, etc.
    *   **Heat Meter:** A vertical VU-meter showing community resonance.

4.  **The Basement: Echo Resonance:**
    *   Full-width feed for Public Zines attached to this specific artifact.

## 4. TYPE-SPECIFIC VIBE TARGETS

| Category | Visual Theme | Core Interaction |
| :--- | :--- | :--- |
| **Anime** | Surveillance / Control Room | "Jump into the Pit" |
| **Music / MV** | Mixing Console / Record Studio | "Drop the Needle" |
| **ASMR** | Analog Tape / Whisper Log | "Enable Deep Listening" |
| **Reading** | Printing Press / Darkroom | "Leaf through the Shards" |

## 5. DESIGN CONSTRAINTS
*   **Zero Emojis.** Use Iconify (lucide/ri) for industrial iconography.
*   **Zero Gradients.** Use textures (noise, concrete, paper) for depth.
*   **Typography:** Inter for body, monospaced fonts for technical metadata, heavy black weights for titles.
