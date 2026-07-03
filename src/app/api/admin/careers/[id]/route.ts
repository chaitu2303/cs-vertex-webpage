import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: any) {
  try {
    const adminSession = request.cookies.get('admin_session')?.value
    if (!adminSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await decrypt(adminSession)
    if (!payload?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await request.json()
    const updated = await prisma.careerPosition.update({
      where: { id: params.id },
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        requirements: data.requirements,
        status: data.status,
        published: data.published
      }
    })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update career' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const adminSession = request.cookies.get('admin_session')?.value
    if (!adminSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await decrypt(adminSession)
    if (!payload?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.careerPosition.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete career' }, { status: 500 })
  }
}
