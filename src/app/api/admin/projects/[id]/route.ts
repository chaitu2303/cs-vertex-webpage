import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncToJSON } from '@/lib/cms'

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const data = await prisma.project.findUnique({
      where: { id }
    })
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const body = await request.json()
    const data = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        category: body.category,
        shortSummary: body.shortSummary,
        challenge: body.challenge,
        solution: body.solution,
        technologies: body.technologies,
        impact: body.impact,
        objectives: body.objectives,
        features: body.features,
        outcomes: body.outcomes,
        useCase: body.useCase,
        image: body.image,
        published: body.published,
        order: body.order
      }
    })
    await syncToJSON('projects')
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await prisma.project.delete({
      where: { id }
    })
    await syncToJSON('projects')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
