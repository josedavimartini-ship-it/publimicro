// Compatibility wrapper: re-export the shared WhatsAppLink from the UI package.
// This keeps older imports (`@/components/WhatsAppLink`) working while the
// codebase migrates to the shared `@publimicro/ui` component.

export { WhatsAppLink as default } from "@publimicro/ui";
