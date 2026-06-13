import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, sendQuoteSubmissionEmail } from '@/lib/email'
import { createClient } from '@/utils/supabase/server'



export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { service, budget, description } = data

    // Validate Auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!service || !budget || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Ensure Customer exists in Prisma
    let customer = await prisma.customer.findUnique({ where: { id: user.id } })
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
        }
      })
    }

    const quote = await prisma.quote.create({
      data: {
        customerId: user.id,
        service,
        budget,
        description
      }
    })

    // Create a Notification for the Admin
    await prisma.notification.create({
      data: {
        userId: 'ADMIN',
        title: 'New Quote Request',
        message: `A new quote request for ${service} has been submitted by ${customer.email}.`
      }
    })

    // Send Emails (Gracefully failing if email setup is incomplete)
    try {
      await sendQuoteSubmissionEmail(customer.email, customer.name || 'Customer', service)

      // Send Admin Email
      await sendEmail({
        to: 'hello@csvertex.com',
        subject: 'URGENT: New Quote Lead',
        html: `<p>A new quote was submitted by ${customer.email} for ${service}.</p><p>Budget: ${budget}</p><p>Details: <pre>${description}</pre></p>`
      })
    } catch (emailErr) {
      console.warn("Email dispatch failed, but quote saved.", emailErr)
    }

    return NextResponse.json({ success: true, quote })
  } catch (error) {
    console.error('Quote submission error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

