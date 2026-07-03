import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncToJSON } from '@/lib/cms'

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const data = await prisma.internship.findUnique({
      where: { id }
    })
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const body = await request.json()
    const data = await prisma.internship.update({
      where: { id },
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
        status: body.status,
        published: body.published,
      }
    })
    await syncToJSON('internships')
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await prisma.internship.delete({
      where: { id }
    })
    await syncToJSON('internships')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}