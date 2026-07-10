import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Get current admin user from cookies to log activity
    let adminId = null;
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (session) {
      const payload = await decrypt(session);
      if (payload && payload.id) adminId = payload.id as string;
    }

    const updatedRequest = await prisma.notifyMe.update({
      where: { id: params.id },
      data: { status }
    });

    // Create Activity Log
    await prisma.notifyMeActivityLog.create({
      data: {
        notifyMeId: params.id,
        action: `Status changed to ${status}`,
        adminId
      }
    });

    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (error) {
    console.error('Failed to update request status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await prisma.notifyMe.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Failed to delete request:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
