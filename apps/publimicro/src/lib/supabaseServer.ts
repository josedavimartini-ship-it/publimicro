import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Minimal CookieStore interface used by the Supabase SSR helper
interface CookieStore {
  get(name: string): { value: string } | undefined;
  set(cookie: { name: string; value: string } & Record<string, unknown>): void;
}

/**
 * Creates a Supabase client for Server Components.
 * Uses cookies for session management.
 * 
 * @example
 * ```tsx
 * // In a Server Component or API Route
 * import { createServerSupabaseClient } from '@/lib/supabaseServer'
 * 
 * const supabase = createServerSupabaseClient()
 * const { data } = await supabase.from('table').select()
 * ```
 */
export function createServerSupabaseClient() {
  // cookies() typing may differ across Next versions; narrow to a small interface instead of `any`
  const cookieStore = cookies() as unknown as CookieStore;
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Can happen in Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Can happen in Server Components
          }
        },
      },
    }
  )
}

/**
 * Creates a Supabase client for Route Handlers (API routes).
 * This is an alias for createServerSupabaseClient for route handlers.
 * 
 * @example
 * // In a Route Handler (app/api/.../route.ts)
 * import { createRouteSupabaseClient } from '@/lib/supabaseServer'
 * 
 * export async function POST(request: Request) {
 *   const supabase = createRouteSupabaseClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 * }
 */
export function createRouteSupabaseClient() {
  return createServerSupabaseClient()
}

// Service role client for admin operations (server-only!)
export function createServiceSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!key) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable — service client requires this key at runtime.');
  }

  return createServerClient(
    url,
    key,
    {
      cookies: {
        get() { return undefined },
        set() {},
        remove() {},
      },
    }
  )
}






