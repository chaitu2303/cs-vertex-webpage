import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { customerId, fileUrl, title } = await request.json()

    if (!customerId || !fileUrl || !title) {
      return NextResponse.json({ error: 'Missing customerId, fileUrl or title' }, { status: 400 })
    }

    const quote = await prisma.quote.findUnique({
      where: { id }
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Create Invoice Document
    const document = await prisma.document.create({
      data: {
        customerId,
        title,
        type: 'Invoice',
        fileUrl
      }
    })

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: customerId,
        title: 'New Invoice Uploaded',
        message: `An invoice has been shared corresponding to your quote request: "${quote.service}".`
      }
    })

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error('Invoice upload creation error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
