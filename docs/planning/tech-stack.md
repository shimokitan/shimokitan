# SHIMOKITAN TECHNICAL STACK

This document outlines the architectural foundation and technology choices for the Shimokitan ecosystem.

## 1. CORE ARCHITECTURE

* **Language:** TypeScript
* **Runtime:** Bun
* **Framework:** Next.js (App Router)
* **API Testing:** Mandatory curl-based verification for all endpoints.

## 2. PERSISTENCE LAYER (HYBRID)

* **Business Layer:** Neon (PostgreSQL)
    * Primary store for relational metadata, user profiles, and quest logic.
    * Integration: Drizzle ORM + Drizzle-Zod for schema-first validation.
* **UGC Layer:** MongoDB Atlas
    * Primary store for District Zines, Echos, and "Narrative Density" data.
    * Handles flexible document structures for varied media attachment types.
* **Identity:** Neon Auth
    * Deeply integrated into the Neon database environment for low-latency attribution.
    * Linked to custom user metadata (Street Credit, Pedalboard state).

## 3. UI & STATE MANAGEMENT

* **Styling:** Tailwind CSS + shadcn/ui
    * Constraint: Flat design only. No gradients.
    * Constraint: Strictly zero emoji usage in the UI layer.
* **Icons:** Iconify
    * Wide selection for Gothic-Street and Tribal-Gangster aesthetics.
* **Global State:** Zustand
    * Manages the "Pedalboard" UI state and modular dashboard filters.
* **Server State:** TanStack Query
    * Manages artifact fetching, Heat Index updates, and Zine resonance.
* **Utilities:**
    * **Lodash:** Data manipulation (filtering/sorting).
    * **Day.js:** Time management for "The Pit" and "The Back-Alley" transitions.

## 4. MEDIA & ASSETS

* **Video Player:** Iframe
    * Handles high-fidelity video embeds and interactive Soundcheck audio.
* **Image Processing:** Sharp
    * Programmatic application of "Atmospheric Grit": grain filters, texture layering, and color grading for UGC.
* **Storage:** Cloudflare R2 (via AWS S3 SDK)
    * Storage for artifact echos, vocal snippets, and digital art artifacts.
* **Optimization:** Next.js Image Component + Sharp.

## 5. INFRASTRUCTURE & SECURITY

* **Deployment:** Vercel (Primary) or VPS (Self-host fallback).
* **Security:** Cloudflare Challenges
    * Protection for the UGC submission engine (The District Zines).
* **Environment:** Arch Linux (Development assumed).

## 6. DEVELOPMENT STANDARDS

* **Component Library:** shadcn/ui installed via CLI.
* **Separation of Concerns:**
    * API calls restricted to `/services`.
    * Logic hooks restricted to `/hooks`.
    * No raw fetch calls in UI components.
* **Architecture:** Separation of business logic from transport layers (HTTP handlers).
