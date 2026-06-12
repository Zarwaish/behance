import { createBrowserClient } from '@supabase/ssr'

export function getSupabaseConfig() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ""
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || ""

  let cleanUrl = rawUrl
  if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}`
  }
  if (cleanUrl.endsWith('/')) {
    cleanUrl = cleanUrl.slice(0, -1)
  }

  return {
    url: cleanUrl,
    anonKey: rawKey,
  }
}

export function createClient() {
  const { url, anonKey } = getSupabaseConfig()

  console.log("Supabase Browser Client Diagnostics:", {
    hasUrl: !!url,
    urlValue: url,
    hasKey: !!anonKey,
  })

  return createBrowserClient(url, anonKey)
}
