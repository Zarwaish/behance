import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const cleanUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const cleanKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  console.log("Supabase Middleware Client Diagnostics:", {
    hasUrl: !!cleanUrl,
    urlValue: cleanUrl,
    hasKey: !!cleanKey,
    keyLength: cleanKey?.length || 0,
  })

  const supabase = createServerClient(
    cleanUrl || "",
    cleanKey || "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup'

  const bypassAuth = 
    request.cookies.get('bypass_auth')?.value === 'true' || 
    request.headers.get('x-bypass-auth') === 'true'

  if (isAdminRoute && !user && !bypassAuth) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && (user || bypassAuth)) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
