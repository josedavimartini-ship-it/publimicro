# Remote Dev Setup — Quick Start (for another machine)

This guide helps you get up and running quickly when you clone the repo on another computer (Windows, macOS or Linux).

## 🔧 Prerequisites
- Node.js 22.x (use nvm or the installer for your OS)
- pnpm >= 10.22.0
  - Recommended: use Corepack to activate a pinned pnpm
    - PowerShell / macOS / Linux: `corepack prepare pnpm@10.26.1 --activate`
  - Or: `npm i -g pnpm@10.26.1`
- Git
- PowerShell (Windows) for the FFmpeg helper scripts

## 📦 Clone & initial setup
1. Clone the repo and switch to the active branch (example):

   git clone git@github.com:josedavimartini-ship-it/publimicro.git
   cd publimicro
   git fetch origin
   git switch feat/media-mapping   # or the branch you intend to work on

2. Install dependencies:

   pnpm install

3. (Optional but recommended) prune pnpm store to save disk before a cold build:

   pnpm store prune

4. Build the shared UI package first (required by other apps):

   pnpm turbo build --filter=@publimicro/ui

5. Build the main app(s):

   pnpm turbo build --filter=@publimicro/publimicro
   # or to build everything:
   pnpm turbo build

6. Start the main app locally (dev):

   pnpm dev:publimicro

## 🔑 Required environment variables
Create `apps/publimicro/.env.local` (DO NOT commit) and set these keys at least:

NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, keep secret

Optional (Stripe / Unsplash):
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=...

> Tip: you can export them into the current shell for temporary test runs, or persist them in `.env.local` for local dev.

## FFmpeg (required for media processing)
We use a portable FFmpeg binary for local media tasks. **Do not commit large binary archives**.

- Windows (PowerShell):
  1. Open PowerShell and run:
     - `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
     - `.\scripts\setup-ffmpeg.ps1`
  2. This downloads a portable FFmpeg into `tools/ffmpeg/` and updates your path in the current session.

- Manual: download a portable build and place the archive in `tools/ffmpeg/` temporarily (the repo ignores `.zip` archives; do not push the archive).
- See: `tools/ffmpeg/README.md` for more details.

## Linting & formatting
- Run lint in memory-friendly batches (use these if you have limited RAM):
  - `npx eslint apps/publimicro/src/components/posting --ext .ts,.tsx --fix`
  - `npx eslint packages/ui --ext .ts,.tsx --fix`
- Or run the repo lint script:
  - `pnpm lint`
- Format with Prettier:
  - `pnpm format`

## Useful maintenance & troubleshooting
- Clean caches (safe): `pnpm store prune`
- Backup local build caches before deleting: move `.turbo/` and `.next/` into `backup/cleanup-YYYY-MM-DD_...`
- If builds fail on TypeScript types (e.g., missing fields): check the local change and add small interface fixes (see `apps/publimicro/src/components/SiteCard.tsx` example).
- If someone rewrites branch history (we cleaned a large file), run these when switching to the remote branch:
  git fetch origin
  git checkout feat/media-mapping
  git reset --hard origin/feat/media-mapping

## Scripts you may need (media work)
- Check media URL reachability (DB):
  node scripts/check-media-urls.mjs --from-db --out artifacts/check-media.json --concurrency 20
- Process and upload media zips: (for specific sitio slug)
  node scripts/process-and-upload-sitio-media.mjs --slug=abare
- Fix missing thumbnails:
  node scripts/fix-thumbnails.mjs --dry
  node scripts/fix-thumbnails.mjs --apply
- Generate & apply SQL mapping (when SUPABASE_SERVICE_ROLE_KEY is set):
  node scripts/generate-media-sql.mjs
  node scripts/apply-media-mapping-local.mjs --file sql/media-mapping-apply.sql --apply

## VS Code recommendations
- Install the recommended extensions (see workspace `.vscode/extensions.json`).
- Settings we prefer are committed to `.vscode/settings.json` (format on save, ESLint auto-fix on save, PowerShell terminal on Windows).

## Notes about large binaries / git LFS
- The repository ignores `tools/ffmpeg/*.zip` by default. Don't commit FFmpeg archives. If you need to keep large binaries in repo history, use Git LFS and coordinate with the team.

---
If you want, I can also create a short checklist or add workspace tasks to `.vscode/tasks.json` (start dev server, run full build, run linter in batches). Want me to add that? 

Safe travels — when you arrive and clone the repo, run the steps above and ping me if anything fails; I'll be ready to continue.