# i18n Revision Note: Media Hosting Framing

## Overview
Replaced the reliance on the "fair use" doctrine and "hotlinking-only" claims in the locale texts (`en.json`, `id.json`, `ja.json`). The updated copy honestly describes Shimokitan's actual architecture and industry practices concerning media hosting.

## What was changed

### 1. `about.a3_1` (How it works)
- **Old**: Claimed that Shimokitan does not host *any* copyrighted media files.
- **New**: Adjusted to accurately state that Shimokitan does not host *playable* copyrighted media formats, but does use visual assets purely for contextual layout purposes.

### 2. `copyright.s2` (No-Host Policy)
- **Old**: "No-Host Policy" which broadly stated that nothing is hosted and everything is hotlinked.
- **New**: "No-Host Policy for Playable Media", clarifying that this strict No-Host approach applies to audio, video, games, etc. Platforms permitting external embedding (like YouTube) are still used for these media formats.

### 3. `copyright.s3` (Visual Media and Referential Use)
- **Old**: Claimed thumbnails and covers are solely hotlinked.
- **New**: Acknowledges that visual assets (thumbnails, avatars, covers) are compressed and hosted locally on Shimokitan's architecture. Removes reliance on the U.S.-centric "fair use" legal doctrine. Focuses instead on the actual intention (contextual, referential, and archival purposes), explicitly denying ownership, and providing a cooperative path for rights holders to request removal.

## Why this was done
Invoking legal doctrines like "fair use" as a shield inside terms can be problematic globally and confrontational. Reframing the documentation around "common archival and referential practice" is an honest representation of what Shimokitan does, is more legally defensible in good faith, and sets a cooperative tone with potential rights holders.
