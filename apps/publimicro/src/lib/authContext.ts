// Re-export the auth hook from the canonical provider implementation.
// Some components import from '@/lib/authContext' for a stable path; keep a small facade here.
export { useAuth } from "@/components/AuthProvider";

// Optionally export types if consumers expect them in the future.
export type { UserProfile } from "@/components/AuthProvider";
