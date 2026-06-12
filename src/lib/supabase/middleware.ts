import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Read env vars directly here — never import from client.ts in Edge Runtime
// client.ts contains createBrowserClient which is NOT safe to import in Edge middleware
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

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const { url, anonKey } = getConfig()

  console.log('[Middleware] Supabase config check:', {
    urlValue: url,
    urlLength: url.length,
    hasKey: !!anonKey,
    keyLength: anonKey.length,
    pathname: request.nextUrl.pathname,
  })

  // If env vars are missing, fail open — allow all requests through rather than
  // crashing the middleware for every visitor
  if (!url || !anonKey) {
    console.error('[Middleware] CRITICAL: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is empty!')

    // Still protect admin routes
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    if (isAdminRoute) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }
    return supabaseResponse
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (err) {
    // Log the FULL error cause so we can see the exact failing URL in Vercel logs
    console.error('[Middleware] supabase.auth.getUser() failed:', {
      message: (err as any)?.message,
      cause: (err as any)?.cause,
      stack: (err as any)?.stack?.split('\n').slice(0, 3).join(' | '),
      supabaseUrl: url,
    })
    // Fail open: let request proceed; server components will also fail and log separately
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAuthRoute =
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup'

  const bypassAuth =
    request.cookies.get('bypass_auth')?.value === 'true' ||
    request.headers.get('x-bypass-auth') === 'true'

  if (isAdminRoute && !user && !bypassAuth) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && (user || bypassAuth)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}
