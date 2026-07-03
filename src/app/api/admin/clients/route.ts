import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncToJSON } from '@/lib/cms'

export async function GET() {
  try {
    const data = await prisma.clientLogo.findMany({
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
    const data = await prisma.clientLogo.create({
      data: {
        companyName: body.companyName,
        industry: body.industry,
        websiteUrl: body.websiteUrl,
        logoUrl: body.logoUrl,
        altText: body.altText,
        order: body.order ? parseInt(body.order, 10) : 0,
        published: body.published ?? true,
      }
    })
    await syncToJSON('clients')
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
