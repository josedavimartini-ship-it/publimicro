Batch C (final) — Changelog

Summary of changes made in the `audit/batch-c-final` branch:

- Security & Preview fixes
  - Make service-worker registration robust in protected previews (fetch+blob fallback) and ensure PWA registration works with preview SSO.
  - Smoke harness supports Vercel preview bypass header and captures artifacts (screenshots + HTML).

- WhatsApp surface/analytics
  - Removed global floating WhatsApp from layout; added `FloatingWhatsAppWrapper` and placed it in property detail, featured/announcement, and account/profile pages only.
  - Added analytics event push on all `WhatsAppLink` clicks: `window.dataLayer.push({ event: 'whatsapp_click', number, url })`.
  - Audit report saved at `tools/WHATSAPP-AUDIT.md`.

- TypeScript & small runtime fixes
  - Fixed multiple `any`/typing hotspots (safe narrowings):
    - `apps/publimicro/src/app/comparar/page.tsx` — narrow Supabase result to `Property[]` and guard.
    - `apps/publimicro/src/app/api/admin/phone-preview/route.ts` — validate `request.json()` and avoid `any` casts.
    - `apps/publimicro/src/app/api/admin/cleanup-listings/route.ts` — normalize row typing while collecting ids.
    - `apps/publimicro/src/app/api/background-check/route.ts` — validate input and cast fields safely.
    - Minor type cleanups in `packages/ui` (WhatsAppLink) and other API routes.

- CI & automation
  - Added/updated `.github/workflows/smoke.yml` to support preview URL and `VERCEL_PROTECTION_BYPASS` secret for protected preview smoke runs and artifact uploads.

- Tests & Docs
  - Plan to add Vitest for unit tests and smoke runs in CI; will propose in the PR.

Notes & next steps:
- TypeScript (workspace) now passes per-package `tsc` checks for the files modified.
- ESLint run failed due to parser config (needs attention in `.eslintrc` / parser packages); I applied `--fix` where safe but a full lint pass may require config updates.
- Preview smoke against protected previews requires a `VERCEL_PROTECTION_BYPASS` token for stable artifacts; recommend adding as GitHub secret to the repo for CI runs.

If you approve, I'll prepare a PR draft with the changes and attach the smoke artifacts and this changelog; I will not push or open the PR until you give explicit approval.