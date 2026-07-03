import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json()
    const poster = await prisma.poster.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        image: data.image,
        thumbnail: data.thumbnail,
        buttonText: data.buttonText,
        buttonUrl: data.buttonUrl,
        category: data.category,
        priority: data.priority,
        displayOrder: data.displayOrder,
        featured: data.featured,
        published: data.published,
        openInModal: data.openInModal,
        showOnHome: data.showOnHome,
        showInOffers: data.showInOffers,
        status: data.status,
        scheduleDate: data.scheduleDate ? new Date(data.scheduleDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      }
    })
    return NextResponse.json(poster)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update poster' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.poster.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete poster' }, { status: 500 })
  }
}
