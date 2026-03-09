# Artifact Resources and Type Issues

## Status & Overview
This document outlines the conceptual and functional friction identified in the current Pedalboard Artifact Registry system, particularly regarding how it handles Music and Anime works within the context of Japanese creative culture (Vtuber, Vsinger, Utaite, etc.).

## 1. Identified Issues

### A. Lifecycle Category Vagueness
The term `lifecycle_category` and its current implementation assume a business-process or technical-file lifecycle. 
- **The Friction:** For the community (Vsingers, Creators), a work doesn't "live" through a lifecycle in a database; it belongs to a **Creative Domain**.
- **Requirement:** Move from a "Process-based" categorization to a "Domain-based" identity (e.g., Sonic/Signal vs. Kinetic/Visual).

### B. Network Gateways & "Scattered" Works
The concept of `network_gateways` implies a technical routing or resource management system.
- **The Friction:** Community works are **scattered**. A Vsinger's work is often a YouTube MV first, then perhaps a Spotify stream, then a social post. 
- **The Conflict:** Labeling a YouTube MV as a "Video" resource under a "Music" artifact creates a mental disconnect where the user feels they are forced to choose between a "Video" entry or a "Music" entry, when it is both.
- **Requirement:** Treat resources not just as "gateways" but as **Manifestations** or **Presences** of the work.

### C. Music System Specs vs. Creative Reality
The `music_system_specs` presets (BPM, ISRC, Format) are too technical and often unavailable or irrelevant for community creators (Utaite, Indie groups).
- **The Friction:** Most community music artifacts are **MVs (Music Videos)** on YouTube. They lack technical ISRC codes but have rich creative metadata (Original vs. Cover, Staff roles, Artistic direction).
- **The Conflict:** Forcing technical specs like "Audio Format" (FLAC/WAV) when the primary work is a YouTube link creates a "vague" and incomplete user experience.
- **Requirement:** Modularize specifications to be context-aware. If it's a "Cover MV", the system should ask for the "Original Reference" rather than a "BPM".

## 2. Target Audience Context
Our users are immersed in **Japanese Creative Culture**:
- **Sonic:** Vtubers, Vsingers, Utaite, Music Producers.
- **Visual:** Anime (Animation), Manga, Anime Art, Cosplayers, Photographers.
- **Technical:** Game Devs, Programmers.

The system must speak their language—balancing "Professional Registry" with "Creative Appreciation."

## 3. Direction for Phase 0 (Music & Anime)
We must revise the **Function**, not just the labels:
1.  **Work Nature:** Define if a work is an **Original Masterwork**, an **Interpretation (Cover)**, or a **Broadcast (Live)**.
2.  **Flexible Provenance:** Allow an artifact to be "Music" while its primary manifestation is "YouTube Video" without technical friction.
3.  **Optional Signatures:** Technical details (BPM/Specs) should be modular add-ons (Signatures), not a mandatory empty box that makes the entry feel "lacking."

## 4. Conclusion
The registry should act as a **Curated Log of Manifestations**. It should handle the fact that a work might be "scattered" across platforms and that the technical "specs" are secondary to the creative "essence" of the work.
