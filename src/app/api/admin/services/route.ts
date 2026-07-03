import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncToJSON } from '@/lib/cms';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(services);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Convert string fields properly if necessary
    const newService = await prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        businessValue: data.businessValue || null,
        icon: data.icon || null,
        deliverables: data.deliverables || null,
        industries: data.industries || null,
        published: data.published ?? true,
        order: data.order ? parseInt(data.order, 10) : 0,
      },
    });
    
    await syncToJSON('services');
    
    return NextResponse.json(newService, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
