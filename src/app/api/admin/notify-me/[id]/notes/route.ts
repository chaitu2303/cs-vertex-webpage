import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { text } = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Note text is required' }, { status: 400 });
    }

    let adminId = null;
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (session) {
      const payload = await decrypt(session);
      if (payload && payload.id) adminId = payload.id as string;
    }

    const note = await prisma.notifyMeNote.create({
      data: {
        notifyMeId: params.id,
        text: text.trim(),
        adminId
      }
    });

    // Also log this activity
    await prisma.notifyMeActivityLog.create({
      data: {
        notifyMeId: params.id,
        action: `Added internal note`,
        adminId
      }
    });

    return NextResponse.json({ success: true, data: note });
  } catch (error) {
    console.error('Failed to add note:', error);
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
