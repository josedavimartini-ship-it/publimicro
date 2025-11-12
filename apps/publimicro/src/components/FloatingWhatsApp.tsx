// Compatibility wrapper for `FloatingWhatsApp`.
// Forward to the shared implementation in `@publimicro/ui` so apps that
// still import the local component keep working while we centralize behavior.

export { FloatingWhatsApp as default } from "@publimicro/ui";
