import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncToJSON } from '@/lib/cms'

export async function GET() {
  try {
    const data = await prisma.internship.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await prisma.internship.create({
      data: {
        title: body.title,
        description: body.description,
        duration: body.duration,
        mode: body.mode,
        location: body.location,
        requirements: body.requirements,
        benefits: body.benefits,
        lastDate: body.lastDate ? new Date(body.lastDate) : null,
        seats: body.seats ? parseInt(body.seats) : null,
        status: body.status || 'Open',
        published: body.published ?? true,
      }
    })
    await syncToJSON('internships')
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}