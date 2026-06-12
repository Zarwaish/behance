import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Read env vars directly — do NOT import from client.ts
// client.ts imports createBrowserClient which shouldn't load in server-only contexts
function getConfig() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  let cleanUrl = rawUrl.trim()
  if (cleanUrl && !cleanUrl.startsWith('http')) {
    cleanUrl = `https://${cleanUrl}`
  }
  cleanUrl = cleanUrl.replace(/\/$/, '')

  return { url: cleanUrl, anonKey: rawKey.trim() }
}

export async function createClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = getConfig()

  console.log('[Server] Supabase config check:', {
    urlValue: url,
    urlLength: url.length,
    hasKey: !!anonKey,
    keyLength: anonKey.length,
  })

  if (!url || !anonKey) {
    console.error('[Server] CRITICAL: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is empty or undefined!')
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from a Server Component — safe to ignore
        }
      },
    },
  })
}
