import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncToJSON } from '@/lib/cms'

export async function GET() {
  try {
    const data = await prisma.project.findMany({
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
    const data = await prisma.project.create({
      data: {
        title: body.title,
        slug: body.slug,
        category: body.category,
        shortSummary: body.shortSummary,
        challenge: body.challenge ?? '',
        solution: body.solution ?? '',
        technologies: body.technologies ?? '',
        impact: body.impact ?? '',
        objectives: body.objectives,
        features: body.features,
        outcomes: body.outcomes,
        useCase: body.useCase,
        image: body.image,
        galleryImages: body.galleryImages,
        timeline: body.timeline,
        github: body.github,
        liveDemo: body.liveDemo,
        documentation: body.documentation,
        isFeatured: body.isFeatured ?? false,
        status: body.status ?? 'Active',
        published: body.published ?? true,
        order: body.order ?? 0
      }
    })
    await syncToJSON('projects')
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
