import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

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

export async function createClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isValidSupabaseConfig(supabaseUrl, supabaseAnonKey)) {
    return null
  }

  return createServerClient(normalizeSupabaseUrl(supabaseUrl)!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Ignore cookie write failures in edge/server contexts
        }
      },
    },
  })
}
