import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { published: true },
      orderBy: [
        { isPinned: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Error fetching public FAQs:", error);
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}
