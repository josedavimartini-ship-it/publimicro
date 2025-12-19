Smoke artifacts audit (Batch C final)

Summary:
- Local smoke run: completed and artifacts saved under `artifacts/` (desktop & mobile PNG/HTML for /, /imoveis, /conta, /entrar, /projetos/carcara).
- Preview smoke run: attempted against preview alias; artifacts may be partial when preview is protected by SSO. If `VERCEL_PROTECTION_BYPASS` token is provided to the harness, runs will capture live content behind the guard.

Key findings (local):
- **Floating WhatsApp** component does **not** appear globally (correct — removed from global layout and limited to allowed pages via `FloatingWhatsAppWrapper`).
- Inline `WhatsAppLink` anchors are present on contact pages and in property CTAs (intended behavior).
- The `WhatsAppLink` component now emits a minimal analytics event (`window.dataLayer.push({ event: 'whatsapp_click', number, url })`) on click, preserving any existing `onClick` handler.

Next steps:
- Re-run smoke harness against preview using `VERCEL_PROTECTION_BYPASS` token to confirm protected preview behaviour and capture full artifacts (I need the token in CI or as a repo secret for automated runs).
- Add a GH Actions workflow step to run `node tools/smoke-whatsapp.js` and upload artifacts to PR; use `VERCEL_PROTECTION_BYPASS` as a secret when needed.
- If you want, I can compress `artifacts/` and attach the ZIP to the prepared PR once you authorize pushing/opening it.

Artifacts (short):
- `artifacts/desktop--_.png` (root)
- `artifacts/desktop--_imoveis.png` (properties)
- `artifacts/desktop--_conta.png` (account)
- `artifacts/mobile--_imoveis.png` (mobile property list)
- `artifacts/mobile--_projetos_carcara.png` (carcará project)

If you'd like, I can proceed to add a PR draft with these artifacts attached and a summary, but I won't push/open the PR without your explicit approval.

