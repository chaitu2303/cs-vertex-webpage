import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const adminSession = request.cookies.get('admin_session')?.value
    if (!adminSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await decrypt(adminSession)
    if (!payload?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await prisma.careerPosition.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminSession = request.cookies.get('admin_session')?.value
    if (!adminSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await decrypt(adminSession)
    if (!payload?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await request.json()
    const newCareer = await prisma.careerPosition.create({
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        requirements: data.requirements,
        status: data.status,
        published: data.published ?? true
      }
    })
    return NextResponse.json(newCareer)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create career' }, { status: 500 })
  }
}
