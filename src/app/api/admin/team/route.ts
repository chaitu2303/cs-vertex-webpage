import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncToJSON } from '@/lib/cms'

export async function GET() {
  try {
    const data = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await prisma.teamMember.create({
      data: {
        name: body.name,
        role: body.role,
        expertise: body.expertise,
        bio: body.bio,
        image: body.image,
        linkedinUrl: body.linkedinUrl,
        githubUrl: body.githubUrl,
        email: body.email,
        published: body.published ?? true,
        order: body.order ?? 0
      }
    })
    await syncToJSON('team')
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
