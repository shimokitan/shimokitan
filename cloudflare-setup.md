## **🏗️ Monorepo Structure Context**

```
your-monorepo/
├── apps/
│   └── main/              # Your Next.js app
│       ├── app/
│       ├── public/
│       ├── next.config.ts
│       ├── package.json
│       └── tsconfig.json
├── packages/              # Shared packages (if any)
├── bun.lockb             # Root lockfile
├── package.json          # Root package.json
├── tsconfig.json         # Root tsconfig
└── turbo.json            # Turborepo config
```

---

## **📦 Step 1: Install Dependencies**

### **Option A: Install in workspace root (recommended)**

```bash
# At monorepo root
bun add -D @opennextjs/cloudflare wrangler
```

### **Option B: Install in the Next.js app**

```bash
# In apps/main/
cd apps/main
bun add -D @opennextjs/cloudflare wrangler
```

I recommend **Option A** (root) so wrangler is available globally across your monorepo.

---

## **⚙️ Step 2: Configure apps/main/next.config.ts**

```typescript
// apps/main/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your existing config
  
  // Important for monorepos: ensure standalone output
  output: "standalone",
};

export default nextConfig;

// Add Cloudflare dev bindings
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
```

---

## **📝 Step 3: Update apps/main/package.json**

Add build and deploy scripts:

```json
{
  "name": "main",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:cf": "opennextjs-cloudflare build",
    "preview:cf": "opennextjs-cloudflare preview",
    "deploy:cf": "opennextjs-cloudflare deploy"
  },
  "devDependencies": {
    "@opennextjs/cloudflare": "latest",
    "wrangler": "latest"
  }
}
```

---

## **🔧 Step 4: Update Root package.json**

Add convenience scripts to run from root:

```json
{
  "name": "your-monorepo",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "deploy:main": "turbo run deploy:cf --filter=main"
  }
}
```

---

## **🏗️ Step 5: Update turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "build:cf": {
      "dependsOn": ["^build", "build"],
      "outputs": [".open-next/**"]
    },
    "deploy:cf": {
      "dependsOn": ["build:cf"],
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## **📁 Step 6: Create apps/main/wrangler.toml**

**Important:** Place `wrangler.toml` in `apps/main/`, NOT at root.

```toml
# apps/main/wrangler.toml
name = "my-nextjs-main-app"
main = ".open-next/worker.js"

compatibility_date = "2025-04-01"
compatibility_flags = [
  "nodejs_compat",
  "global_fetch_strictly_public"
]

[[assets]]
directory = ".open-next/assets"
binding = "ASSETS"

[[services]]
binding = "WORKER_SELF_REFERENCE"
service = "my-nextjs-main-app"
```

---

## **🚫 Step 7: Update .gitignore**

At **root** `.gitignore`:

```bash
# Cloudflare
.open-next
.wrangler
.dev.vars

# Build outputs
.next
.turbo
dist
build

# Bun
bun.lockb  # Don't ignore this! Keep it committed
```

At **apps/main/.gitignore**:

```bash
.open-next
.wrangler
.dev.vars
.next
```

---

## **🎯 Deployment Workflow**

### **From Monorepo Root:**

```bash
# Build the Next.js app first
bun run build --filter=main

# Build for Cloudflare
cd apps/main
bun run build:cf

# Preview locally
bun run preview:cf

# Deploy
bun run deploy:cf
```

### **Or use Turbo (recommended):**

```bash
# From root
bun run deploy:main
```

---

## **🔐 Environment Variables**

### **For Local Development:**

Create `apps/main/.dev.vars`:

```bash
# apps/main/.dev.vars
DATABASE_URL=your-local-db
API_KEY=your-test-key
```

### **For Production:**

```bash
# From apps/main/ directory
npx wrangler secret put DATABASE_URL
npx wrangler secret put API_KEY
```

---

## **📦 Handling Shared Packages**

If you have shared packages in `packages/*`:

```json
// apps/main/package.json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/utils": "workspace:*"
  }
}
```

The OpenNext adapter should handle workspace dependencies, but if you have issues:

```typescript
// apps/main/next.config.ts
const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/utils"],
};
```

---

## **🚀 Complete Deployment Commands**

```bash
# 1. From root - login to Cloudflare (first time only)
npx wrangler login

# 2. Build everything with Turbo
bun run build

# 3. Navigate to app
cd apps/main

# 4. Build for Cloudflare
bun run build:cf

# 5. Test locally
bun run preview:cf

# 6. Deploy
bun run deploy:cf
```

---

## **⚡ Pro Tips for Monorepos:**

1. **Keep bun.lockb at root** - never ignore it, commit to git
2. **Don't commit .open-next/** - it's generated, add to .gitignore
3. **Use Turbo for builds** - faster with caching
4. **Deploy from apps/main/** - not from root
5. **One wrangler.toml per deployable app** - if you have multiple Next.js apps

---

## **🐛 Common Monorepo Issues:**

**"Can't find workspace packages"**
→ Make sure `transpilePackages` includes your workspace deps

**"Wrangler can't find main"**
→ Run commands from `apps/main/`, not root

**"Build works but deploy fails"**
→ Check that `main = ".open-next/worker.js"` path is correct relative to wrangler.toml

**"Module resolution errors"**
→ Ensure root `tsconfig.json` has proper paths configured

---