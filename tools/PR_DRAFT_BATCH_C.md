# PR Draft: Batch C — audit/batch-c-final

## Summary
This PR contains the final set of changes for "Batch C": lint/type cleanup, scoping of Floating WhatsApp, smoke harness hardening, service worker registration fix, and CI smoke workflow improvements.

## Changes
- Lint & Type: fixed multiple unused variables, narrowed types, removed unsafe `any`, and applied ESLint autofixes across `apps/publimicro`, `apps/share`, `apps/tudo`, and `packages/ui`.
- Floating WhatsApp: removed global floating widget; added `FloatingWhatsAppWrapper` to allowed pages (`/conta`, `/anuncios`, `/assinatura`) and added click analytics (dataLayer push).
- Service worker: robust register-sw fallback (fetch + blob) to avoid 401s on protected previews.
- Smoke harness: hardened `tools/smoke-whatsapp.js` for protected previews (`x-vercel-protection-bypass`), retries, Chromium→Firefox fallback, and artifact saving.
- CI: updated `.github/workflows/smoke.yml` to accept preview URL and bypass secret and upload artifacts.
- Docs: `tools/WHATSAPP-AUDIT.md`, `tools/SMOKE-ARTIFACTS-AUDIT-BATCH-C-FINAL.md`, and `docs/CHANGELOG-BATCH-C.md` added.

## Artifacts
- `artifacts/smoke-artifacts-batch-c.zip` (screenshots & HTML for desktop/mobile for /, /imoveis, /conta, /entrar, /projetos/carcara)
- Lint reports: `.eslint-final-reports/*`
- Smoke logs: `tools/smoke-local-*.txt`

## Checks performed
- ESLint (per-folder and full workspace) — no remaining errors.
- TypeScript (workspace) — no type errors reported.
- Smoke harness runs against local dev servers (see artifacts) — screenshots saved.

## Notes / Action items
- I did NOT push or open the PR. Please review the draft and tell me when to push and open a PR for review.
- If you'd like, I can also run the CI smoke workflow once `VERCEL_PROTECTION_BYPASS` secret is set in the repo settings.

---

*Prepared by GitHub Copilot (Raptor mini — Preview)*