import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (admin && await bcrypt.compare(password, admin.password)) {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', process.env.ADMIN_SECRET || 'fallback_secret', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
