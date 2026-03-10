# Artist Profile: Lit.link Reference & Analysis

## Overview
The "Artist Page" in Shimokitan is designed to be a "terminal-grade" replacement for Linktree or Japan's widely used **lit.link**. This document analyzes the current implementation and how we can pivot toward the high-density, visually engaging patterns found in Japanese artist ecosystems.

## Current Implementation (`EntityProfileTerminal.tsx`)
Right now, the artist profile follows a "Command-Line Registry" aesthetic.

### Key Characteristics:
- **Mechanical Desktop Layout**: A 12-column grid split into Identity (Left), Uplinks (Center), and Archive (Right).
- **Uniform Card Density**: Every `socialLink` is currently rendered as a large, 64px-height card with a border and icon box.
- **Verticality**: On mobile, it results in a very long vertical scroll because each link takes up significant screen real estate.
- **Tone**: Professional, stark, and "sealed" (Registry-style).

### Pain Points:
- **Mobile Overload**: The cards are "too big" for a quick link-in-bio experience.
- **Lack of Hierarchy**: A "Spotify" link looks exactly the same as an "X" (Twitter) link.
- **Low Information Density**: It lacks the "visual dashboard" feel that lit.link users expect.

---

## What is Lit.link?
**lit.link** is the dominant link-in-bio platform for Japanese artists, creators, and underground idols. Unlike the Western "Linktree" (which is mostly a list of buttons), lit.link is a **visual aggregator**.

### Core Features of Lit.link:
1. **Picture Links (Gird-based)**:
   - Artists use square image grids (2x2 or 3x3) to showcase different social channels visually.
   - It feels more like an "Icon Board" than a list.
2. **Variable Density**:
   - Supports different button styles: "Button" (standard), "Text" (compact), and "Picture" (visual).
3. **High Customization**:
   - Japanese design often focuses on "Yūgen" (subtle depth) and "Kanso" (simplicity), but lit.link allows for "Visual Chaos" where information is dense but organized.
4. **Mobile-First**:
   - Designed to be edited and viewed almost exclusively on smartphones.

---

## Comparative Analysis

| Feature | Shimokitan (Current) | Lit.link (Japanese Standard) |
| :--- | :--- | :--- |
| **Logic** | "User Registry" (Read-only status) | "Active Portal" (Entry points) |
| **Navigation** | List-based vertical scroll | Grid-based "Icon Board" |
| **Spacing** | Generous (Desktop-first) | Tight/Responsive (Mobile-first) |
| **Iconography** | Large monochrome icon boxes | Integrated graphics/custom icons |

---

## Recommended Pivot: "The Terminal Shard System"
To replace lit.link for our artists, we should move from a "List" to a **"Shard Grid"**.

### 1. Primary Uplink (Wide Card)
- Keep the current card style for **High-Priority targets** (e.g., "Official Store", "New Release").
- Add decorative "Digital Tape" or "Live Status" indicators.

### 2. Social Shards (2x2 Grid)
- Group common socials (Instagram, X, TikTok, YouTube) into a **compact grid** of square icons.
- This mimics the "Picture Link" style of lit.link while keeping the terminal aesthetic (Monochrome icons, slight scanlines).

### 3. Archive/Resonance (The Sidebar)
- Keep the "Resonance Shards" (Right panel) as a secondary archive, but ensure it doesn't fight for attention with the primary uplinks.

## Next Steps
1. Refactor `EntityProfileTerminal.tsx` to accept "Priority" metadata for links.
2. Implement a `LinkShard` component that toggles between "Full-Width" and "Grid-Square" based on density requirements.
3. Optimize the mobile sticky header to be even more compact (minimalist signal strength indicator).
