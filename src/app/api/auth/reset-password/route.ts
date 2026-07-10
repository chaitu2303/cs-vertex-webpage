import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { jwtVerify, decodeJwt } from 'jose';

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    // 1. Decode token payload without verifying to get the email
    let decodedPayload;
    try {
      decodedPayload = decodeJwt(token);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    const email = decodedPayload.email as string;
    if (!email) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 });
    }

    const FIXED_ADMIN_EMAIL = "admin@csvertex.com";
    if (email === FIXED_ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Cannot reset the fixed admin password' }, { status: 403 });
    }

    // 2. Fetch the admin to get the current password hash
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // 3. Verify the token using the secret + CURRENT password hash
    // If the password was already changed, the hash won't match, and verification fails.
    // This makes the token strictly single-use.
    const secretStr = (process.env.JWT_SECRET || 'default_secret') + admin.password;
    const secret = new TextEncoder().encode(secretStr);
    
    try {
      await jwtVerify(token, secret);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid, expired, or already used token' }, { status: 400 });
    }

    // 4. Hash new password and update DB
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { email },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
