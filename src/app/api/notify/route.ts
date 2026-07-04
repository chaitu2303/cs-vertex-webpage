import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const existing = await prisma.launchRegistration.findUnique({
      where: { email }
    })

    if (existing) {
      return NextResponse.json({ error: 'This email is already subscribed.' }, { status: 409 })
    }

    // Insert email into LaunchRegistration table
    await prisma.launchRegistration.create({
      data: { email }
    })

    // Brevo email confirmation
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to CS Vertex Notifications',
        html: `
          <p>Hi,</p>
          <p>Thank you for subscribing to CS Vertex updates.</p>
          <p>We'll notify you whenever this course, workshop, internship or service becomes available.</p>
          <p>Stay Connected.</p>
          <br/>
          <p>CS Vertex<br/><a href="https://csvertex.com" style="color: #E8440A;">https://csvertex.com</a></p>
        `
      })
      console.log('Confirmation email sent successfully via Brevo.')
    } catch (emailErr) {
      console.error('Error sending confirmation email via Brevo:', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error handling subscription:', err)
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 })
  }
}
