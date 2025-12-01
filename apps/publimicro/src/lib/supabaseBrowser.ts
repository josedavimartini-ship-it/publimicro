import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

/**
 * Creates a Supabase client for browser/client-side components.
 * This is a singleton to avoid creating multiple clients.
 * 
 * @example
 * ```tsx
 * 'use client'
 * import { createBrowserSupabaseClient } from '@/lib/supabaseBrowser'
 * 
 * function MyComponent() {
 *   const supabase = createBrowserSupabaseClient()
 *   // use supabase...
 * }
 * ```
 */
export function createBrowserSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabaseClient
}
