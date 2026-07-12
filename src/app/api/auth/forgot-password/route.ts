import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const FIXED_ADMIN_EMAIL = "admin@csvertex.com";

    // Generic success message to prevent enumeration
    const successResponse = NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });

    // We only support password reset for DB admins, not the hardcoded fixed admin
    if (normalizedEmail === FIXED_ADMIN_EMAIL) {
      return successResponse; 
    }

    const admin = await prisma.admin.findUnique({ where: { email: normalizedEmail } });
    if (!admin) {
      return successResponse;
    }

    // Generate JWT (15 mins)
    // IMPORTANT: Appending the current password hash to the secret ensures the token is SINGLE-USE.
    // Once the password is changed, the secret changes, and the token becomes instantly invalid.
    const secretStr = (process.env.JWT_SECRET || 'default_secret') + admin.password;
    const secret = new TextEncoder().encode(secretStr);
    
    const token = await new SignJWT({ email: normalizedEmail })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(secret);

    // Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`;

    // Professional HTML Email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #090a0a; border: 1px solid #333; border-radius: 8px; overflow: hidden; color: #F5F1EA;">
        <div style="background-color: #111; padding: 30px; text-align: center; border-bottom: 1px solid #333;">
          <img src="https://csvertex.com/assets/logo.png" alt="CS Vertex Logo" style="height: 40px; width: auto;" />
        </div>
        
        <div style="padding: 40px 30px; background-color: #090a0a;">
          <h2 style="color: #fff; margin-top: 0; margin-bottom: 20px; font-weight: 500;">Password Reset Request</h2>
          
          <p style="color: #ccc; line-height: 1.6; margin-bottom: 25px;">
            We received a request to reset the password for your CS Vertex Admin account associated with this email address.
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 14px 30px; background-color: #ff5c2a; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; letter-spacing: 0.5px;">Reset Password</a>
          </div>
          
          <p style="color: #ff5c2a; font-size: 14px; text-align: center; margin-bottom: 30px;">
            ⚠️ This link will expire in exactly 15 minutes.
          </p>
          
          <p style="color: #888; font-size: 13px; line-height: 1.5; border-top: 1px dashed #333; padding-top: 20px;">
            If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged and your account is secure.
          </p>
        </div>
        
        <div style="background-color: #050505; padding: 20px; text-align: center; border-top: 1px solid #333;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            &copy; ${new Date().getFullYear()} CS Vertex. All rights reserved.<br/>
            Internal Administrative Systems
          </p>
        </div>
      </div>
    `;

    // Send Mail via Resend
    await sendEmail({
      to: normalizedEmail,
      subject: 'Reset Your CS Vertex Password',
      html: emailHtml
    });

    return successResponse;

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
