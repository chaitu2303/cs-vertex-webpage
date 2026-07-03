import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await prisma.launchRegistration.findUnique({
      where: { email }
    })

    if (existing) {
      return NextResponse.json({ 
        message: 'Already registered', 
        isFounder: existing.isFounder 
      })
    }

    // Determine if they are in the first 25
    const currentFoundersCount = await prisma.launchRegistration.count({
      where: { isFounder: true }
    })

    const isFounder = currentFoundersCount < 25

    // Create registration
    const registration = await prisma.launchRegistration.create({
      data: {
        email,
        isFounder
      }
    })

    return NextResponse.json({
      message: 'Successfully registered',
      isFounder: registration.isFounder,
      seatsRemaining: Math.max(0, 25 - (currentFoundersCount + (isFounder ? 1 : 0)))
    })

  } catch (error) {
    console.error('Launch registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
