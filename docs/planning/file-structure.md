# SHIMOKITAN MONOREPO STRUCTURE

This repository uses a **Turborepo** architecture to manage the multiple districts of the Shimokitan ecosystem. This ensures a unified "Gutter-Punk" design system while allowing specialized logic for the main, commercial (Akiba), and adult (Kabukicho) zones.

## 📂 HIGH-LEVEL STRUCTURE

```text
shimokitan/
├── apps/                   # District Applications (Next.js)
│   ├── main/               # shimokitan.live (The Core District)
│   ├── akiba/              # akiba.shimokitan.live (The Bazaar)
│   └── kabukicho/          # kabukicho.shimokitan.live (The Sanctuary)
│
├── packages/               # Shared District Infrastructure
│   ├── ui/                 # "Gutter-Punk" Design System (shadcn + grit)
│   ├── db/                 # Shared Data Layer (Neon & MongoDB schemas)
│   ├── auth/               # Neon Auth configurations
│   ├── utils/              # Shared helper logic (Lodash, Day.js)
│   └── config/             # Shared Tailwind/TS/Lint configurations
│
├── docs/                   # District Manifesto and Documentation
├── .agent/                 # Agentic workflows and logs
├── package.json            # Workspace definitions
└── turbo.json              # Turborepo task pipeline
```

## 🏗️ APP DIRECTORY (e.g., `apps/main/src`)

Every district app follows a standardized internal layout to ensure the "Strict Separation" of transport and business logic.

```text
apps/[district]/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Auth routes
│   │   ├── (main)/         # District specific routes (e.g., /zines)
│   │   └── api/            # HTTP Handlers (Transport Layer ONLY)
│   │
│   ├── components/         # Distict-specific UI modules
│   │   └── modules/        # e.g., pedalboard, soundchecks
│   │
│   ├── hooks/              # District-specific logic hooks
│   ├── services/           # Data orchestration (calls packages/db)
│   └── store/              # District state (Zustand)
```

## 🎨 PACKAGE DIRECTORY (The Shared Soul)

### `packages/ui`
The foundry for the Shimokitan aesthetic.
*   `src/components/ui/`: Base shadcn/ui components.
*   `src/components/grit/`: Shared textures, high-grain filters, and concrete overlays.
*   `src/styles/globals.css`: The "Charcoal/Concrete" color palette.

### `packages/db`
The unified source of truth for the "Business Layer" and "UGC Layer."
*   `src/business/`: Relational schemas (Neon/Drizzle) for Ink, Quests, and Profiles.
*   `src/ugc/`: Document schemas (MongoDB) for Zines and Artifact Echoes.
*   `src/services/`: Shared database interaction logic (The core services).

## 📜 CORE CONVENTIONS

### 1. The Monorepo Boundary
*   **Apps** are responsible for **Routing** and **Presentation**.
*   **Packages** are responsible for **Data Integrity** and **The Aesthetic Pattern**.
*   Strict Rule: No App should talk to the Database without using the `packages/db` services.

### 2. Design Consistency
*   All UI components must be pulled from `@shimokitan/ui`.
*   **Zero Emojis** are permitted in any UI component or text string.
*   **Zero Gradients** are permitted. Use flat "Distorted Paper" or "Concrete" textures instead.

### 3. Internationalization
*   Standard UI is English. Multilingual support (if added) resides in `packages/utils/i18n`.
