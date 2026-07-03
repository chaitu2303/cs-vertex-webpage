import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncToJSON } from '@/lib/cms'

export async function GET() {
  try {
    const data = await prisma.workshop.findMany({
      orderBy: { date: 'asc' }
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await prisma.workshop.create({
      data: {
        title: body.title,
        description: body.description,
        date: body.date ? new Date(body.date) : null,
        time: body.time,
        speaker: body.speaker,
        mode: body.mode,
        seats: body.seats,
        banner: body.banner,
        status: body.status ?? "Upcoming",
        published: body.published ?? true,
      }
    })
    await syncToJSON('workshops')
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
