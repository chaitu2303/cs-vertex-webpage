import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Increment the viewCount by 1
    const updatedFaq = await prisma.fAQ.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
    
    return NextResponse.json({ success: true, viewCount: updatedFaq.viewCount });
  } catch (error) {
    console.error("Error incrementing FAQ view count:", error);
    return NextResponse.json({ error: "Failed to increment view count" }, { status: 500 });
  }
}
