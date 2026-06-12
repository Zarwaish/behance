import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  let cleanUrl = rawUrl.trim()
  if (cleanUrl && !cleanUrl.startsWith('http')) {
    cleanUrl = `https://${cleanUrl}`
  }
  cleanUrl = cleanUrl.replace(/\/$/, '')

  const diagnostics: Record<string, any> = {
    env: {
      rawUrlDefined: !!rawUrl,
      rawUrlLength: rawUrl.length,
      cleanUrlValue: cleanUrl,
      rawKeyDefined: !!rawKey,
      rawKeyLength: rawKey.length,
      // Show only the first 20 chars of key so we can confirm it's correct without full exposure
      keyPreview: rawKey.slice(0, 20) + (rawKey.length > 20 ? '...' : ''),
    },
    fetch: null,
    error: null,
  }

  if (!cleanUrl) {
    diagnostics.error = 'NEXT_PUBLIC_SUPABASE_URL is empty — env var not available in this runtime'
    return NextResponse.json(diagnostics, { status: 500 })
  }

  // Test: simple unauthenticated fetch to Supabase REST endpoint
  const testUrl = `${cleanUrl}/rest/v1/projects?select=id&limit=1`
  try {
    const res = await fetch(testUrl, {
      headers: {
        apikey: rawKey,
        Authorization: `Bearer ${rawKey}`,
      },
    })
    const text = await res.text()
    diagnostics.fetch = {
      status: res.status,
      ok: res.ok,
      url: testUrl,
      responsePreview: text.slice(0, 200),
    }
  } catch (err: any) {
    diagnostics.error = {
      message: err?.message,
      cause: String(err?.cause ?? ''),
      name: err?.name,
      url: testUrl,
    }
  }

  return NextResponse.json(diagnostics, { status: diagnostics.error ? 500 : 200 })
}
