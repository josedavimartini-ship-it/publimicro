# Vercel Deployment Setup for PubliMicro Monorepo

## Quick Setup (One-time only)

For each app, you need to create a Vercel project once. After that, every `git push` will automatically deploy all apps.

### Steps:

1. Go to: https://vercel.com/new
2. Find repository: `josedavimartini-ship-it/publimicro`
3. Click **Import** 8 times (once for each app)

### Project Configuration (for each):

| App Name | Project Name | Root Directory | Framework |
|----------|--------------|----------------|-----------|
| global   | publiglobal  | `.` (empty)    | Next.js   |
| journey  | publijourney | `.` (empty)    | Next.js   |
| motors   | publimotors  | `.` (empty)    | Next.js   |
| proper   | publiproper  | `.` (empty)    | Next.js   |
| outdoor  | publioutdoor | `.` (empty)    | Next.js   |
| machina  | publimachina | `.` (empty)    | Next.js   |
| share    | publishare   | `.` (empty)    | Next.js   |
| tudo     | publitudo    | `.` (empty)    | Next.js   |

### Important Settings:

- **Root Directory**: Leave EMPTY or set to `.` (repository root)
- **Build Command**: Leave empty (uses vercel.json from each app)
- **Install Command**: Leave empty (uses vercel.json from each app)
- **Output Directory**: Leave empty (uses vercel.json from each app)

Each app's `vercel.json` contains:
```json
{
  "buildCommand": "pnpm run build --filter=@publimicro/[app-name]",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "framework": "nextjs",
  "outputDirectory": "apps/[app-name]/.next"
}
```

## After Setup

Once all 9 projects are created, every `git push` will automatically:
- Trigger builds for all 9 apps
- Deploy to production (main branch)
- Deploy to preview (other branches)

## Current Status

✅ publimicro - Deployed
⏳ publiglobal - Needs setup
⏳ publijourney - Needs setup
⏳ publimotors - Needs setup
⏳ publiproper - Needs setup
⏳ publioutdoor - Needs setup
⏳ publimachina - Needs setup
⏳ publishare - Needs setup
⏳ publitudo - Needs setup
