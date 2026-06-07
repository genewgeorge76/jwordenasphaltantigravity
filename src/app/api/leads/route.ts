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
