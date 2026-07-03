import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.certificate.findMany({
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
    const data = await prisma.certificate.create({
      data: {
        certificateId: body.certificateId,
        studentName: body.studentName,
        email: body.email,
        course: body.course,
        type: body.type,
        issueDate: new Date(body.issueDate),
        status: body.status || 'Valid',
        fileUrl: body.fileUrl,
        qrCodeUrl: body.qrCodeUrl || null,
      }
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
