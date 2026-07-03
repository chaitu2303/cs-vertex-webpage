import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncToJSON } from '@/lib/cms'

export async function GET() {
  try {
    const data = await prisma.course.findMany({
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
    const data = await prisma.course.create({
      data: {
        title: body.title,
        description: body.description,
        duration: body.duration,
        level: body.level,
        syllabus: body.syllabus,
        price: body.price,
        trainer: body.trainer,
        banner: body.banner,
        published: body.published ?? true,
      }
    })
    await syncToJSON('courses')
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
