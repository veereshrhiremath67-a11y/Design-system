import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * supabase.ts — optional Supabase client for auth/storage features.
 *
 * Returns null when env vars are not configured so builds never break
 * before Supabase is fully wired. Configure in .env:
 *   NEXT_PUBLIC_SUPABASE_URL      (https://<ref>.supabase.co)
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY (anon public key)
 *   SUPABASE_SERVICE_ROLE_KEY     (server-only, keep private)
 */

function resolve(
  varName: string
): string | undefined {
  const v = process.env[varName]
  return v && v.length > 0 ? v : undefined
}

export function createSupabaseClient(): SupabaseClient | null {
  const url = resolve("NEXT_PUBLIC_SUPABASE_URL")
  const anonKey = resolve("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  if (!url || !anonKey) return null
  return createClient(url, anonKey)
}

// Server-only admin client (service role key never exposed to the browser).
export function createAdminSupabaseClient(): SupabaseClient | null {
  const url = resolve("NEXT_PUBLIC_SUPABASE_URL")
  const serviceKey = resolve("SUPABASE_SERVICE_ROLE_KEY")
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export const supabase = createSupabaseClient()
