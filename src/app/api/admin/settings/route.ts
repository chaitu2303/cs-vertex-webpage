import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const adminSession = request.cookies.get('admin_session')?.value
    if (!adminSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await decrypt(adminSession)
    if (!payload?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { key, value } = await request.json()

    if (!key || typeof value !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })

    return NextResponse.json({ success: true, setting })
  } catch (error) {
    console.error('Settings API Error:', error)
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminSession = request.cookies.get('admin_session')?.value
    if (!adminSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await decrypt(adminSession)
    if (!payload?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const searchParams = request.nextUrl.searchParams
    const key = searchParams.get('key')

    if (key) {
      const setting = await prisma.siteSetting.findUnique({ where: { key } })
      return NextResponse.json(setting)
    }

    const settings = await prisma.siteSetting.findMany()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}
