import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { subject, body } = await request.json();

    if (!subject || !body) {
      return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 });
    }

    const lead = await prisma.notifyMe.findUnique({
      where: { id: params.id }
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Send email using Brevo
    await sendEmail({
      to: lead.email,
      subject,
      html: body
    });

    // Log the activity
    let adminId = null;
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (session) {
      const payload = await decrypt(session);
      if (payload && payload.id) adminId = payload.id as string;
    }

    await prisma.notifyMeActivityLog.create({
      data: {
        notifyMeId: params.id,
        action: `Sent email: "${subject}"`,
        adminId
      }
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
