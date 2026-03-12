# SEO Compliance Report - shimokitan (apps/main)

This document provides an overview of the SEO compliance status for the `apps/main` directory of the Shimokitan project.

## Summary

The application follows high-tier SEO standards for Next.js, leveraging dynamic metadata, structured data (JSON-LD), and proper internationalization with localized canonicals.

- **Status**: ✅ Optimally Compliant
- **Key Features**: Dynamic Sitemap, Localized Canonicals & `x-default`, Full Metadata Coverage, Structured Data (Home, About, Artifacts).

---

## 1. Technical SEO

### Robots.txt
- **Status**: ✅ Configured
- **File**: `apps/main/src/app/robots.ts`
- **Features**: Points to dynamic sitemap; disallows `/api/` and `/auth/`.

### Sitemap & Discoverability
- **Status**: ✅ Configured & Dynamic
- **File**: `apps/main/src/app/sitemap.ts`
- **Features**:
  - Dynamically fetches all **Artifacts** and **Entities** from the database.
  - Sets appropriate `changeFrequency` and `priority` for content discovery.

### Canonicals & Hreflang
- **Status**: ✅ Fully Optimized
- **File**: `apps/main/src/app/[locale]/layout.tsx`
- **Features**:
  - **Localized Canonicals**: Automatically generates canonical tags based on the current locale.
  - **x-default**: Properly points to English (`/en`) as the default language.
  - **Alternates**: Correctly links `en`, `ja`, and `id` versions of the site.

---

## 2. Structured Data (JSON-LD)

### Broad Coverage
- **Homepage**: ✅ `WebSite` and `Organization` schema implemented.
- **About Page**: ✅ `AboutPage` schema implemented.
- **Artifact Pages**: ✅ `MusicRecording` or `CreativeWork` schema implemented per-item.
- **Feature**: All structured data is injected server-side for optimal crawlability.

---

## 3. On-Page SEO

### Metadata Coverage
- **Status**: ✅ 100% Coverage
- **Dynamic Descriptions**:
  - **Home/About**: Localized descriptions from dictionary.
  - **Artifacts/Artists/Registry**: Unique meta descriptions added to `generateMetadata`.
  - **Legal**: Layout-level description template for all legal subpages.

### Heading Structure (H1)
- **Status**: ✅ High Compliance
- **Compliance**: Every major page and browse module uses a single, semantic `<h1>` tag for the primary topic.

### OpenGraph & Twitter
- **Status**: ✅ Configured
- **Root Layout** provides global branding; dynamic pages override with content-aware images and titles.

---

## 4. Semantic HTML & Accessibility

### Accessibility Improvements
- **Status**: ✅ Ongoing Polish
- **Icons**: Decorative elements in major browser components (Artists/Artifacts) have been updated with `aria-hidden="true"` to reduce screen reader noise.
- **Language**: Correctly set at the `<html>` level via `RootLayout`.

### Structural Elements
- Proper use of `<main>`, `<article>`, `<nav>`, and `<aside>` across all layouts.

---

## 5. Maintenance Recommendations

1. **Alt Text Audits**: Periodically audit user-uploaded artifact thumbnails to ensure titles remain descriptive.
2. **Performance Monitoring**: Monitor Core Web Vitals (LCP/CLS) as more dynamic shards are added to the Bento grid.
3. **Internal Linking**: Ensure the Footer and Sidebar provide a clear hub-and-spoke internal linking strategy to help crawler depth.

---
*Last Audit: 13 March 2026*