import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  // Warn at runtime if critical public Supabase env vars are missing (helps detect mis-configured deployments)
  // This is intentionally informational only and does not expose secrets.
   
  console.warn('Warning: Missing Supabase public env vars. NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Images and client auth may fail in production.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
