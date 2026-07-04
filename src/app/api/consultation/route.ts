import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendConsultationCustomerEmail, sendConsultationAdminNotification } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    if (!data.name || !data.email || !data.phone || !data.service || !data.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const lead = await prisma.formSubmission.create({
      data: {
        formType: 'Consultation',
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
        data: JSON.stringify({
          country: data.country,
          service: data.service,
          budget: data.budget,
          timeline: data.timeline,
          description: data.description
        }),
        status: 'New'
      }
    })

    // Send emails
    await Promise.all([
      sendConsultationCustomerEmail(data.email, data.name),
      sendConsultationAdminNotification(data)
    ])

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Consultation API Error:', error)
    return NextResponse.json({ error: 'Failed to submit consultation request' }, { status: 500 })
  }
}
