WhatsApp usage audit

Summary:
- Floating WhatsApp widget: moved out of global layout and added only to property detail, featured/announcement, and account/profile pages via `FloatingWhatsAppWrapper` (already implemented).
- Inline `WhatsAppLink` components and direct `wa.me`/`api.whatsapp.com` anchors exist in contact pages, property details, and CTA sections. These are generally allowed (explicit contact points) but should be audited for tracking and consent where appropriate.

Files found (non-exhaustive):
- apps/publimicro/src/components/FloatingWhatsAppWrapper.tsx (wrapper placed on allowed pages)
- apps/publimicro/src/app/imoveis/[id]/page.tsx (FloatingWhatsAppWrapper added)
- apps/publimicro/src/app/destaques/page.tsx (FloatingWhatsAppWrapper added)
- apps/publimicro/src/app/conta/page.tsx (FloatingWhatsAppWrapper added)
- apps/publimicro/src/app/contato/page.tsx (uses `WhatsAppLink` inline)
- apps/publimicro/src/app/imoveis/[id]/... (property contact section uses `WhatsAppLink`)

Recommendations:
- Keep inline `WhatsAppLink` components in contact/contact forms and property details (they are explicit contact points).
- Keep the floating WhatsApp component only in the limited pages (done).
- Add analytics events when WhatsApp links are clicked (if not present) for better monitoring (implemented: `WhatsAppLink` now pushes `event: 'whatsapp_click'` into `window.dataLayer`).
- Confirm GDPR/consent messaging for contact forms and links (legal check): add consent or privacy note where required.

Next steps I can take now (unless you prefer to review first):
- Audit remaining pages that still render inline WhatsApp anchors and add click analytics or gating where appropriate.
- Add tests for `WhatsAppLink` click analytics (requires test runner; propose adding Vitest if you want test coverage added now).

Please tell me if you want me to proceed with the analytics sweep and test additions; otherwise I'll continue with TypeScript triage and low-risk fixes.