import { createBrowserClient } from '@supabase/ssr'

function normalizeSupabaseUrl(url: string | undefined) {
  if (!url) return undefined

  const trimmed = url.trim().replace(/\/+$/, '')
  return trimmed.replace(/\/rest\/v1$/i, '')
}

function isValidSupabaseConfig(url: string | undefined, key: string | undefined) {
  const normalizedUrl = normalizeSupabaseUrl(url)

  return Boolean(
    normalizedUrl &&
      key &&
      /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(normalizedUrl) &&
      (key.startsWith('sb_publishable_') || key.startsWith('eyJ'))
  )
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isValidSupabaseConfig(supabaseUrl, supabaseAnonKey)) {
    return null
  }

  return createBrowserClient(normalizeSupabaseUrl(supabaseUrl)!, supabaseAnonKey!)
}
