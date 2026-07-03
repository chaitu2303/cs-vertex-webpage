import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posters = await prisma.poster.findMany({
      orderBy: [
        { priority: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })
    return NextResponse.json(posters)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posters' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const poster = await prisma.poster.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        image: data.image,
        thumbnail: data.thumbnail,
        buttonText: data.buttonText,
        buttonUrl: data.buttonUrl,
        category: data.category || 'Offers',
        priority: data.priority || 0,
        displayOrder: data.displayOrder || 0,
        featured: data.featured || false,
        published: data.published || false,
        openInModal: data.openInModal || false,
        showOnHome: data.showOnHome ?? true,
        showInOffers: data.showInOffers || false,
        status: data.status || 'Draft',
        scheduleDate: data.scheduleDate ? new Date(data.scheduleDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      }
    })
    return NextResponse.json(poster)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create poster' }, { status: 500 })
  }
}
