import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, phone, interestedRole, type } = data

    if (!name || !email || !interestedRole) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const notification = await prisma.notifyMe.create({
      data: {
        name,
        email,
        phone,
        interestedRole,
        type: type || 'Job'
      }
    })

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error('NotifyMe Error:', error)
    return NextResponse.json({ error: 'Failed to submit notification' }, { status: 500 })
  }
}
