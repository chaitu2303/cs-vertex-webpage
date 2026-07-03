import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncToJSON } from '@/lib/cms'

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const data = await prisma.teamMember.findUnique({
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
    const data = await prisma.teamMember.update({
      where: { id },
      data: {
        name: body.name,
        role: body.role,
        expertise: body.expertise,
        bio: body.bio,
        image: body.image,
        linkedinUrl: body.linkedinUrl,
        githubUrl: body.githubUrl,
        email: body.email,
        published: body.published,
        order: body.order
      }
    })
    await syncToJSON('team')
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await prisma.teamMember.delete({
      where: { id }
    })
    await syncToJSON('team')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
