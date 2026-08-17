import { NextResponse } from 'next/server'

/**
 * Proxy from the site to the backend "brain".
 *
 * Two things were wrong here.
 *
 * 1. The API key fell back to a hardcoded 'dev_override_key_123'. A default
 *    credential in committed source is not a default, it is a published one:
 *    if the backend ever accepted it, anyone reading the repo held a valid key.
 *
 * 2. BRAIN_URL defaulted to https://jwordenoperations.onrender.com, which now
 *    answers 503 with <title>Service Suspended</title> — verified over three
 *    90-second attempts, so it is suspended rather than cold-starting. Every
 *    scan submitted by a visitor was being posted into a dead host and lost,
 *    and the silent default is what let that go unnoticed.
 *
 * Both now come from the environment with no fallback, and a missing value is
 * reported as a misconfiguration instead of being quietly papered over.
 */

export async function POST(req: Request) {
  const brainUrl = process.env.BRAIN_URL
  const masterKey = process.env.JWORDEN_MASTER_KEY

  if (!brainUrl || !masterKey) {
    console.error(
      '[api/brain] BRAIN_URL and JWORDEN_MASTER_KEY must both be set. ' +
        'Point BRAIN_URL at the live API (https://jworden-api.fly.dev); the ' +
        'previous default, jwordenoperations.onrender.com, is suspended.',
    )
    return NextResponse.json(
      { error: 'Lead intake is not configured. Please call us directly.' },
      { status: 503 },
    )
  }

  try {
    const body = await req.json()

    const response = await fetch(`${brainUrl}/api/v1/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': masterKey,
      },
      body: JSON.stringify({
        name: body.name || 'Unknown',
        phone: body.phone || 'Unknown',
        address: body.address || 'Unknown',
      }),
      // Without a timeout this hangs on the platform's own limit while a
      // customer watches a spinner. A suspended host is exactly the case.
      signal: AbortSignal.timeout(15_000),
    })

    if (!response.ok) {
      // Log the destination, not the key. The status alone does not say which
      // backend was called, and that was the missing clue when the default
      // silently pointed at a dead service.
      console.error(
        `[api/brain] ${brainUrl} returned ${response.status} ${response.statusText}`,
      )
      return NextResponse.json({ error: 'Connection to Brain failed' }, { status: 502 })
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    console.error(`[api/brain] request to ${brainUrl} failed:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
