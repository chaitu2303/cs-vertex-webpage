import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

// Initialize Resend Client if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // Insert email directly into launch_notifications table using Prisma raw query
    await prisma.$executeRaw`
      INSERT INTO launch_notifications (email) 
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING
    `

    // Optional Resend email confirmation
    if (resend) {
      try {
        await resend.emails.send({
          from: 'CS Vertex <no-reply@csvertex.com>',
          to: email,
          subject: 'CS Vertex Launch Reminder',
          text: `Thank you for joining CS Vertex.\nWe'll notify you before launch.`,
          html: `
            <div style="font-family: sans-serif; background: #030303; color: #fff; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #E8440A;">
              <h2 style="color: #E8440A; letter-spacing: 0.1em;">CS VERTEX SYSTEMS</h2>
              <p>Thank you for joining CS Vertex.</p>
              <p>We will notify you before the official launch on June 24, 2026.</p>
              <br/>
              <hr style="border-color: #222;" />
              <p style="font-size: 11px; color: #666;">This is an automated reminder. Please do not reply directly to this email.</p>
            </div>
          `
        })
        console.log('Confirmation email sent successfully via Resend.')
      } catch (emailErr) {
        console.error('Error sending confirmation email via Resend:', emailErr)
      }
    } else {
      console.log('Resend confirmation email skipped (RESEND_API_KEY not set).')
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error handling subscription:', err)
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 })
  }
}
