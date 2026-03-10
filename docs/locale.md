# Localization (i18n)

The project implements a **Prefix-Based Locale Strategy** using Next.js Middleware and a shared UI/DB layer.

## Locale Configuration
- **Available Locales**: `en`, `id`, `ja`
- **Default Locale**: `en`
- **Location**: Defined in `packages/utils/src/i18n/index.ts`

## Routing Workflow
- All public routes are prefixed with the locale (e.g., `/en/artist/inr_prayer`).
- **Middleware**: `apps/main/src/middleware.ts` handles redirects.
  - If a user visits `/artist/slug` (no locale prefix), the middleware detects their preference (cookie or browser language) and redirects to `/[locale]/artist/slug`.
  - Static assets and APIs are excluded from middleware processing.

## Database Strategy
- **ORM**: Drizzle.
- **Single Source of Truth**: `packages/db/src/schema.ts` uses translation tables for entities and artifacts.
  - `entities` (base table) -> `entities_i18n` (translation table).
  - `artifacts` (base table) -> `artifacts_i18n` (translation table).
- **Joining**: Data fetches join the translation table matching the current `locale` segment from the URL.

## Shared Packages
- `packages/utils`: Contains dictionary management (`getDictionary`) and path helpers (`getLocalePath`).
- `packages/db`: Handles translation queries based on the provided locale.
