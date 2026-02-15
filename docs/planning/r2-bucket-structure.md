# SHIMOKITAN R2 BUCKET STRUCTURE

This document defines the organization of assets within the unified Cloudflare R2 bucket. To ensure future-proof connectivity across districts (Akiba, Kabukicho, etc.), all assets reside in a single namespace categorized by media type and functional context.

## 1. CORE PHILOSOPHY

*   **Unified Namespace:** No physical separation by district. Districts are treated as metadata/tags, not storage boundaries.
*   **Media-First Routing:** Top-level organization is by media type to facilitate specialized edge processing (e.g., Sharp optimization for images).
*   **Contextual Isolation:** Second-level organization is by functional domain (Artifacts, Zines, Echos).

## 2. PATH TEMPLATE

Paths are constructed using the following hierarchy:
`{media_type}/{context}/{identifier}/{filename}`

| Segment | Description | Examples |
| :--- | :--- | :--- |
| `media_type` | Defines the processing pipeline & TTL rules. | `images`, `audio`, `video`, `raw` |
| `context` | The functional domain of the asset. | `artifacts`, `zines`, `profiles`, `echos` |
| `identifier` | Unique ID (NanoID) for the entity. | `shard_8z2k`, `user_vx91` |
| `filename` | Extension-preserved NanoID of the asset. | `az8j2...webp`, `vx91k...mp3` |

## 3. FOLDER DEFINITIONS

### 3.1 `images/`
Routed through the **Grain & Grit** pipeline (Sharp).
*   `images/artifacts/`: Cover art and visual fragments of Shards.
*   `images/profiles/`: User avatars and street-cred identification.
*   `images/zines/`: Assets embedded within District Zine layouts.

### 3.2 `audio/`
Prioritized for low-latency streaming.
*   `audio/echos/`: Vocal fragments and environmental field recordings.
*   `audio/soundchecks/`: High-fidelity loops for the interactive pedalboard.

### 3.3 `video/`
Handles high-fidelity uploads (Fallback for non-embedded content).
*   `video/artifacts/`: Found-footage snippets.
*   `video/ambient/`: Background atmosphere for The Pit.

### 3.4 `raw/`
Standardized storage for non-processed files.
*   `raw/zines/`: PDF/Print-ready versions of finalized Zines.
*   `raw/metadata/`: Large-scale narrative density exports (if applicable).

## 4. EDGE PROCESSING RULES

| Path Prefix | Rule | Applied Effect |
| :--- | :--- | :--- |
| `images/*` | Grain & Grit | High-grain noise filter, resolution downscaling, color grading. |
| `audio/*` | Stream Optimization | Byte-range request support, aggressive caching. |
| `*/artifacts/*` | CDN Purge on Sync | Purge cache whenever a Shard's metadata is updated in Neon. |

## 5. EXAMPLE PATHS

*   **Akiba Artifact:** `images/artifacts/shard_8z2k/b1x9k2.webp`
*   **Kabukicho Audio Fragment:** `audio/echos/shard_jx92/v4m8n1.mp3`
*   **Global User Avatar:** `images/profiles/user_cl76/p5q2r9.webp`
