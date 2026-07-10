import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncToJSON } from '@/lib/cms'
import { logAudit } from '@/lib/audit'

export async function GET() {
  try {
    const data = await prisma.testimonial.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await prisma.testimonial.create({
      data: {
        clientName: body.clientName,
        company: body.company,
        email: body.email,
        feedback: body.feedback,
        rating: body.rating ?? 5,
        published: body.published ?? true,
      }
    })
    await syncToJSON('testimonials')
    await logAudit('Created Testimonial', body.clientName, `Rating: ${body.rating}`)
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
