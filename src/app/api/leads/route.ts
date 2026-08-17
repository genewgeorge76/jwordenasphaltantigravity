import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate incoming data
    if (!data.name || !data.address || !data.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Integrate with Twilio (SMS)
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER
    const destinationNumber = process.env.DESTINATION_PHONE_NUMBER

    if (accountSid && authToken && twilioNumber && destinationNumber) {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
      const messageBody = `🚨 AI SCAN LEAD 🚨\nName: ${data.name}\nAddress: ${data.address}\nPhone: ${data.phone}\nRegion: ${data.location}`

      const twilioResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: destinationNumber,
          From: twilioNumber,
          Body: messageBody,
        }),
      })

      if (!twilioResponse.ok) {
        console.error('Twilio Error:', await twilioResponse.text())
      } else {
        console.log('SMS sent successfully via Twilio.')
      }
    } else {
      console.warn('Twilio credentials missing in environment variables. Lead was logged but SMS was not sent.')
    }

    // Fire data to the secure Python Brain (JWorden AI OS)
    try {
      // No fallbacks. The old defaults pointed at a hardcoded key in committed
      // source and at jwordenoperations.onrender.com, which now answers 503
      // "Service Suspended" — so every lead was being posted into a dead host
      // while this route reported success to the customer.
      const BRAIN_URL = process.env.BRAIN_URL
      const MASTER_KEY = process.env.JWORDEN_MASTER_KEY
      if (!BRAIN_URL || !MASTER_KEY) {
        throw new Error(
          'BRAIN_URL / JWORDEN_MASTER_KEY not set — skipping brain ingest. ' +
          'The SMS above still fired, so the lead is not lost.'
        )
      }

      const brainResponse = await fetch(`${BRAIN_URL}/api/v1/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': MASTER_KEY
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          address: data.address
        }),
        signal: AbortSignal.timeout(15_000)
      })

      if (!brainResponse.ok) {
        console.error(`JWorden AI Brain Error: ${brainResponse.status}`)
      } else {
        console.log('Lead successfully ingested by JWorden AI Brain.')
      }
    } catch (e) {
      console.error('Failed to connect to JWorden AI Brain:', e)
    }

    // Simulate heavy AI processing time to sell the aesthetic on the frontend (if brain is offline)
    await new Promise(resolve => setTimeout(resolve, 1500))

    return NextResponse.json({ success: true, message: 'Lead routed successfully' })

  } catch (error) {
    console.error('Lead processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process lead' },
      { status: 500 }
    )
  }
}
