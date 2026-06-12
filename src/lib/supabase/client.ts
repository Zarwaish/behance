import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const cleanUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const cleanKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  console.log("Supabase Browser Client Diagnostics:", {
    hasUrl: !!cleanUrl,
    hasKey: !!cleanKey,
  })

  return createBrowserClient(
    cleanUrl || "",
    cleanKey || ""
  )
}
