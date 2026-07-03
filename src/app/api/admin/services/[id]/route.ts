import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncToJSON } from '@/lib/cms';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
    });
    
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        businessValue: data.businessValue || null,
        icon: data.icon || null,
        deliverables: data.deliverables || null,
        industries: data.industries || null,
        published: data.published,
        order: data.order !== undefined ? parseInt(data.order, 10) : undefined,
      },
    });
    
    await syncToJSON('services');
    
    return NextResponse.json(updatedService);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.service.delete({
      where: { id },
    });
    
    await syncToJSON('services');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
