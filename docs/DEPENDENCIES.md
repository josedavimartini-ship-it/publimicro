# 📦 PubliMicro Dependencies Guide

Complete reference for all dependencies, sub-dependencies, and development tools used in the PubliMicro monorepo.

**Last Updated:** December 2, 2025  
**Node.js:** ≥18.0.0  
**pnpm:** 10.22.0

---

## 🎯 Quick Setup (New Machine)

```powershell
# 1. Install Node.js 18+ from nodejs.org

# 2. Install pnpm
npm install -g pnpm@latest

# 3. Clone and install
git clone https://github.com/josedavimartini-ship-it/publimicro.git
cd publimicro
pnpm install

# 4. Install VS Code extensions (optional but recommended)
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

---

## 🔧 Core Dependencies

### Build System
| Package | Version | Purpose |
|---------|---------|---------|
| `turbo` | ^2.6.1 | Monorepo build orchestration |
| `pnpm` | 10.22.0 | Package manager with workspaces |
| `typescript` | ^5.9.0 | Type checking |
| `eslint` | ^9.x | Linting |

### Framework Stack
| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^16.0.6 | React framework (App Router) |
| `react` | ^19.0.0 | UI library |
| `react-dom` | ^19.0.0 | React DOM renderer |

### Styling
| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^4.1.0 | Utility-first CSS |
| `@tailwindcss/postcss` | ^4.1.0 | PostCSS plugin |
| `clsx` | ^2.x | Conditional classnames |
| `tailwind-merge` | ^2.x | Merge Tailwind classes |

### Database & Auth
| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | ^2.x | Supabase client |
| `@supabase/auth-helpers-nextjs` | ^0.10.x | Next.js auth helpers |
| `@supabase/ssr` | ^0.5.x | Server-side rendering support |

### Payments
| Package | Version | Purpose |
|---------|---------|---------|
| `stripe` | ^17.x | Stripe API client |
| `@stripe/stripe-js` | ^4.x | Stripe.js loader |

### 3D & Maps
| Package | Version | Purpose |
|---------|---------|---------|
| `@react-three/fiber` | ^8.x | React Three.js renderer |
| `@react-three/drei` | ^9.x | Three.js helpers |
| `three` | ^0.170.x | 3D graphics library |
| `leaflet` | ^1.9.x | Interactive maps |
| `react-leaflet` | ^4.x | React Leaflet wrapper |

### Forms & State
| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | ^7.x | Form handling |
| `@hookform/resolvers` | ^3.x | Form validation resolvers |
| `zod` | ^3.x | Schema validation |
| `zustand` | ^4.x | State management |

### UI Components
| Package | Version | Purpose |
|---------|---------|---------|
| `framer-motion` | ^11.x | Animations |
| `lucide-react` | ^0.460.x | Icons |
| `react-icons` | ^5.x | Additional icons |
| `swiper` | ^11.x | Carousels/sliders |
| `react-day-picker` | ^8.x | Date picker |
| `focus-lock` | ^1.x | Modal focus management |

### Utilities
| Package | Version | Purpose |
|---------|---------|---------|
| `date-fns` | ^4.x | Date manipulation |
| `uuid` | ^11.x | UUID generation |
| `archiver` | ^7.x | ZIP file creation |
| `jszip` | ^3.x | ZIP file handling |
| `@xmldom/xmldom` | ^0.9.x | KML/XML parsing |

### Email
| Package | Version | Purpose |
|---------|---------|---------|
| `resend` | ^4.x | Email sending |

### Development
| Package | Version | Purpose |
|---------|---------|---------|
| `@types/node` | ^22.x | Node.js types |
| `@types/react` | ^19.x | React types |
| `@types/leaflet` | ^1.x | Leaflet types |
| `@types/three` | ^0.170.x | Three.js types |
| `rimraf` | ^6.x | Cross-platform rm -rf |

---

## 📦 Package-Specific Dependencies

### `@publimicro/ui` (packages/ui)
Shared React components used across all apps.

```json
{
  "dependencies": {
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "framer-motion": "^11.x",
    "lucide-react": "^0.460.x"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

### `@publimicro/stripe` (packages/stripe)
Stripe integration utilities.

```json
{
  "dependencies": {
    "stripe": "^17.x"
  }
}
```

---

## 🔌 VS Code Extensions

### Required
| Extension | ID | Purpose |
|-----------|-----|---------|
| ESLint | `dbaeumer.vscode-eslint` | Linting |
| Prettier | `esbenp.prettier-vscode` | Code formatting |
| Tailwind CSS IntelliSense | `bradlc.vscode-tailwindcss` | Tailwind autocomplete |

### Recommended
| Extension | ID | Purpose |
|-----------|-----|---------|
| TypeScript | Built-in | TypeScript support |
| GitLens | `eamodio.gitlens` | Git history |
| Error Lens | `usernamehw.errorlens` | Inline errors |
| Thunder Client | `rangav.vscode-thunder-client` | API testing |
| Prisma | `prisma.prisma` | SQL highlighting |
| GitHub Copilot | `github.copilot` | AI assistance |

### Install All Extensions
```powershell
# Required
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss

# Recommended
code --install-extension eamodio.gitlens
code --install-extension usernamehw.errorlens
code --install-extension rangav.vscode-thunder-client
code --install-extension prisma.prisma
```

---

## 🌐 External Services

### Required
| Service | Purpose | Setup Guide |
|---------|---------|-------------|
| **Supabase** | Database + Auth | See `docs/guides/DATABASE-GUIDE.md` |
| **Vercel** | Deployment | See `VERCEL-SETUP.md` |

### Optional (for full features)
| Service | Purpose | Setup Guide |
|---------|---------|-------------|
| **Stripe** | Payments | See `docs/guides/STRIPE-GUIDE.md` |
| **Resend** | Email | See `PRODUCTION-SETUP-CHECKLIST.md` |
| **Unsplash** | Demo images | Get API key at unsplash.com/developers |
| **ngrok** | External testing | See `NGROK-RUNBOOK.md` |

---

## 📋 Version Pinning

The project uses pnpm's catalog feature for consistent versions:

```yaml
# pnpm-workspace.yaml
catalog:
  next: "^16.0.6"
  react: "^19.0.0"
  react-dom: "^19.0.0"
  typescript: "^5.9.0"
  tailwindcss: "^4.1.0"
  turbo: "^2.6.1"
```

### Allowed Deprecated Versions
Some transitive dependencies are deprecated but required:

```json
{
  "pnpm": {
    "allowedDeprecatedVersions": {
      "node-domexception": "*"
    }
  }
}
```

---

## 🔄 Updating Dependencies

### Check for Updates
```powershell
# Check outdated packages
pnpm outdated

# Interactive update
pnpm update --interactive
```

### Update Process
1. **Check changelogs** for breaking changes
2. **Update catalog** in `pnpm-workspace.yaml` for shared versions
3. **Run type-check**: `pnpm type-check`
4. **Run build**: `pnpm turbo build`
5. **Test locally** before committing

### Critical Updates (Do Not Auto-Update)
- `next` - Major framework, test thoroughly
- `react` - Core dependency
- `@supabase/*` - Auth/DB changes can break
- `stripe` - Payment API changes

---

## 🧹 Cleanup Commands

```powershell
# Remove node_modules (all packages)
pnpm clean:deep

# Clear pnpm cache
pnpm store prune

# Clear TurboRepo cache
Remove-Item -Recurse -Force .turbo

# Full fresh install
pnpm clean:deep; pnpm install
```

---

## 📊 Bundle Analysis

To analyze bundle size:

```powershell
# Build with bundle analyzer
ANALYZE=true pnpm build

# Or use Next.js bundle analyzer
# Add to next.config.ts:
# const withBundleAnalyzer = require('@next/bundle-analyzer')
```

---

## ⚠️ Known Issues

### 1. `node-domexception` Deprecation Warning
**Cause:** Transitive dependency of Supabase  
**Solution:** Allowed in `pnpm.allowedDeprecatedVersions`  
**Impact:** None (cosmetic warning during install)

### 2. FFmpeg for Video Processing
**Note:** Video transcoding uses native `child_process` with `@ffmpeg-installer/ffmpeg`  
**File:** `apps/publimicro/src/lib/ffmpegUtils.ts`  
**Requirements:** FFmpeg binary is auto-installed via npm package

### 3. Leaflet CSS Import
**Note:** Must import Leaflet CSS manually in client components  
**Import:** `import 'leaflet/dist/leaflet.css'`

---

## 🚚 Portable Setup (USB Drive)

To run on a new machine from USB:

1. **Copy entire folder** including `node_modules/`
2. **Or** copy without `node_modules/` and run:
   ```powershell
   pnpm install --offline  # If pnpm cache is available
   # OR
   pnpm install           # With internet
   ```
3. **Copy `.env.local`** files (not in git)
4. **Run**: `pnpm dev:publimicro`

### Required Files for Portable Setup
```
publimicro/
├── apps/
├── packages/
├── supabase/
├── docs/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
└── .env.local (create manually)
```
