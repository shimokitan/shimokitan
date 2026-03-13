# Dashboard Migration Summary

This document summarizes the migration of administrative functionalities from `apps/main` to `apps/dashboard` and the resolution of subsequent technical hurdles.

## 🏗️ Architectural Changes

### Dashboard Application Setup
- **Source Directory**: Moved `app` and `components` into a `src` directory for standard compliance.
- **Environment**: Linked `.env.local` to provide database and R2 storage secrets.
- **Middleware**: Implemented locale detection and enforced role-based access control (RBAC).

## 🚀 Migrated Components

The following components were moved to `@/components` in `apps/dashboard`:
- `RegistryTable.tsx`: Generic data table with filtering and selection.
- `DeleteButton.tsx`: Integrated deletion logic with confirmation.
- `RestoreButton.tsx`: Recovery logic for soft-deleted items.
- `Link.tsx`: Localized linking system.

## 🛠️ Infrastructure & Logic

### Services & Hooks
- Moved `anilist.ts` service and `useAnilistSync.ts` hook to support external metadata fetching.
- Integrated `ensureUserSync` for secure server-side session validation.

### Schema & Data
- **IP Anchoring**: Added `works` and `works_i18n` tables to the Neon database via Drizzle.
- **Artifact Links**: Established foreign key relationships between `artifacts` and `works`.
- **Data Backfill**: Executed `migrate-works.ts` to link existing orphans to their parent IPs.

## 🩹 Key Resolutions

| Error | Solution |
| :--- | :--- |
| **Missing root layout tags** | Removed redundant `app/layout.tsx` and centralized tags in `[locale]/layout.tsx`. |
| **Middleware 404/Redirects** | Updated middleware to handle root (`/`) path and locale prefixes correctly. |
| **Module not found (validations)** | Fixed import paths from `@/lib/validations/` to explicit file paths. |
| **Broken Connection Strings** | Provided missing environment variables for the dashboard sub-app. |

## 📍 Next Steps
1. **Works Registry UI**: Implement the list view for "IP Anchors" (Works).
2. **Lint Cleanup**: Address remaining non-critical warnings in `ArtifactForm`.
3. **Main App Refactor**: Prune legacy administrative code from `apps/main`.
