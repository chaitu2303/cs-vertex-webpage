import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Ensure we don't cache this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const currentFoundersCount = await prisma.launchRegistration.count({
      where: { isFounder: true }
    })

    return NextResponse.json({
      foundersCount: currentFoundersCount,
      seatsRemaining: Math.max(0, 25 - currentFoundersCount),
      totalRegistrations: await prisma.launchRegistration.count()
    })
  } catch (error) {
    console.error('Launch status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
