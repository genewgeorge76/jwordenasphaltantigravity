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

    // This is the junction where the lead gets routed.
    // Currently, it securely logs the lead on the server.
    // NEXT STEP: Integrate with Resend (Email), Twilio (SMS), or a Webhook.
    
    console.log('============= NEW AI SATELLITE LEAD =============')
    console.log(`Name:    ${data.name}`)
    console.log(`Address: ${data.address}`)
    console.log(`Phone:   ${data.phone}`)
    console.log(`Region:  ${data.location}`)
    console.log('=================================================')

    // Simulate heavy AI processing time to sell the aesthetic on the frontend
    await new Promise(resolve => setTimeout(resolve, 2000))

    return NextResponse.json({ success: true, message: 'Lead routed successfully' })

  } catch (error) {
    console.error('Lead processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process lead' },
      { status: 500 }
    )
  }
}
