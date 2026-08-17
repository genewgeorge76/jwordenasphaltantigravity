import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Basic-auth gate for /os.
 *
 * This previously fell back to hardcoded credentials — user "gene", password
 * "password123" — whenever OS_USER/OS_PASSWORD were unset, with a comment
 * saying they would become env vars later. The fallback is the whole problem:
 * the values sit in committed source, so the dashboard was protected by a
 * password anyone with repo access already knew, and nothing about a working
 * login would reveal that the env vars had never been set.
 *
 * It now FAILS CLOSED. No credentials configured means nobody gets in.
 *
 * That is the opposite of the choice made in the API's brute-force guard, and
 * deliberately so. There, failing open kept the owner from being locked out of
 * his own system by a Redis outage, and a second control still applied. Here
 * the only alternative to failing closed is a publicly known password, and the
 * fix is one env var rather than an outage.
 */

/** Length-independent comparison, so response timing does not leak the secret. */
function safeEqual(a: string, b: string): boolean {
  // Compare fixed-width over the longer input: returning early on a length
  // mismatch would leak the password's length through timing alone.
  const len = Math.max(a.length, b.length)
  let diff = a.length ^ b.length
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return diff === 0
}

function unauthorized(): NextResponse {
  return new NextResponse('Auth required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure JWorden OS Area"' },
  })
}

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/os')) {
    return NextResponse.next()
  }

  const validUser = process.env.OS_USER
  const validPassword = process.env.OS_PASSWORD

  if (!validUser || !validPassword) {
    // Deliberately indistinguishable from a wrong password to the caller, but
    // loud in the logs, because "misconfigured" and "locked out" look identical
    // from the outside and only one of them is fixable by trying again.
    console.error(
      '[/os] OS_USER and OS_PASSWORD are not set — refusing all access. ' +
        'Set both in the Vercel project environment to enable the dashboard.',
    )
    return unauthorized()
  }

  const header = req.headers.get('authorization')
  if (!header || !header.startsWith('Basic ')) {
    return unauthorized()
  }

  let user = ''
  let pwd = ''
  try {
    // atob throws on malformed base64; an unhandled throw here becomes a 500,
    // which tells an attacker their input reached the decoder and turns a
    // garbage header into an error-log flood.
    const decoded = atob(header.slice(6))
    const sep = decoded.indexOf(':')
    if (sep === -1) return unauthorized()
    user = decoded.slice(0, sep)
    pwd = decoded.slice(sep + 1) // passwords may contain ':'
  } catch {
    return unauthorized()
  }

  // Both comparisons always run — && would short-circuit on a wrong username
  // and leak, by timing, whether the username alone was correct.
  const userOk = safeEqual(user, validUser)
  const passOk = safeEqual(pwd, validPassword)
  if (userOk && passOk) {
    return NextResponse.next()
  }

  return unauthorized()
}

export const config = {
  matcher: ['/os/:path*'],
}
