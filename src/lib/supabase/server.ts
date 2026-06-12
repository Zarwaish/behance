import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const cleanUrl = rawUrl?.trim()
  const cleanKey = rawKey?.trim()

  console.log("Supabase Server Initialization Diagnostics:", {
    hasRawUrl: !!rawUrl,
    rawUrlLength: rawUrl?.length || 0,
    cleanUrlValue: cleanUrl,
    hasRawKey: !!rawKey,
    rawKeyLength: rawKey?.length || 0,
  })

  if (!cleanUrl || !cleanKey) {
    console.error("Missing critical Supabase environment variables! URL or Key is empty.")
  }

  return createServerClient(
    cleanUrl || "",
    cleanKey || "",
    {
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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
