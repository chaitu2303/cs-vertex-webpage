import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, phone, interestedRole, type } = data

    if (!name || !email || !interestedRole) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await prisma.notifyMe.findFirst({
      where: { email }
    })

    if (existing) {
      return NextResponse.json({ error: 'This email is already subscribed.' }, { status: 409 })
    }

    const notification = await prisma.notifyMe.create({
      data: {
        name,
        email,
        phone,
        interest: interestedRole || 'Career / Recruitment',
        sourcePage: type || 'Job',
        message: 'Automatically subscribed from Recruitment / Internship section.'
      }
    })

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
    } catch (emailErr) {
      console.error('Error sending confirmation email via Resend:', emailErr)
    }

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error('NotifyMe Error:', error)
    return NextResponse.json({ error: 'Failed to submit notification' }, { status: 500 })
  }
}
