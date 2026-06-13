import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'



export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json()
    const { status, customerId } = data

    if (!status || !customerId) {
      return NextResponse.json({ error: 'Missing status or customerId' }, { status: 400 })
    }

    // Update Quote
    const quote = await prisma.quote.update({
      where: { id },
      data: { status }
    })

    // Fetch customer email
    const customer = await prisma.customer.findUnique({ where: { id: customerId } })

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: customerId,
        title: 'Quote Status Updated',
        message: `Your quote for ${quote.service} has been updated to: ${status}.`
      }
    })

    // Send Email to Customer
    if (customer && customer.email) {
      await sendEmail({
        to: customer.email,
        subject: `CS Vertex Quote Update: ${status}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #ff5c2a;">Quote Update</h2>
            <p>Hello,</p>
            <p>Your quote request for <strong>${quote.service}</strong> has been updated by our engineering team.</p>
            <p>New Status: <strong>${status}</strong></p>
            <br/>
            <p>You can track the progress and view more details by logging into your CS Vertex Customer Portal.</p>
            <br/>
            <p>Best Regards,</p>
            <p><strong>The CS Vertex Team</strong></p>
          </div>
        `
      })
    }

    return NextResponse.json({ success: true, quote })
  } catch (error) {
    console.error('Quote update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
