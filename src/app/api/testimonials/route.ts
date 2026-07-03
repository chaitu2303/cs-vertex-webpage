import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'



export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { clientName, company, email, rating, feedback } = body

    if (!clientName || !feedback) {
      return NextResponse.json({ error: 'Name and feedback are required' }, { status: 400 })
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        clientName,
        company,
        email,
        rating: Number(rating) || 5,
        feedback,
        published: false // explicitly set for Admin Review
      }
    })

    // Optionally create a notification for Admins
    try {
      // Find an admin user to notify, or just create a general notification if your schema allows
      // For now, we'll just log it. The Admin dashboard can pull unpublished testimonials directly.
      console.log('New testimonial queued for review:', newTestimonial.id)
    } catch (e) {
      console.error('Failed to notify admin:', e)
    }

    return NextResponse.json({ success: true, testimonial: newTestimonial })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}

