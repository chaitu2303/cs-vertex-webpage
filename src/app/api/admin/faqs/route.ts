import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newFaq = await prisma.fAQ.create({
      data: {
        question: body.question,
        answer: body.answer,
        category: body.category || 'General',
        isPinned: body.isPinned || false,
        isFeatured: body.isFeatured || false,
        published: body.published !== false, // default true
        order: body.order || 0
      }
    });
    return NextResponse.json(newFaq);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}

// PATCH used for reordering
export async function PATCH(req: NextRequest) {
  try {
    const items = await req.json();
    
    // items should be [{ id: "...", order: 1 }, { id: "...", order: 2 }]
    for (const item of items) {
      await prisma.fAQ.update({
        where: { id: item.id },
        data: { order: item.order }
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering FAQs:", error);
    return NextResponse.json({ error: "Failed to reorder FAQs" }, { status: 500 });
  }
}
