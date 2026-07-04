"use server"

import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

/**
 * Saves an email to the launch_notifications table.
 * Uses Prisma (direct DB URL) to bypass Supabase RLS.
 * Table: launch_notifications (id, email, created_at)
 * Email column has UNIQUE constraint.
 */
export async function subscribeEmail(email: string): Promise<{ ok: boolean; message: string }> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'Invalid email address.' }
  }

  const cleanEmail = email.trim().toLowerCase()

  try {
    // ON CONFLICT DO NOTHING handles duplicate emails gracefully
    const rows = await prisma.$executeRawUnsafe(
      'INSERT INTO launch_notifications (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
      cleanEmail
    )

    if (rows === 0) {
      // Email already existed
      return { ok: true, message: "You're already on the list! We'll notify you at launch." }
    }

    // --- Send Welcome Email via Brevo ---
    try {
      await sendEmail({
        to: cleanEmail,
        subject: 'Welcome to CS Vertex - Launch Notification Confirmed',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #333;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #FF6A00; margin: 0; font-size: 24px; letter-spacing: 2px;">CS VERTEX</h2>
              <p style="color: #888; margin-top: 5px; font-size: 12px; letter-spacing: 4px;">SYSTEMS ONLINE</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #e5e5e5;">
              Hello,
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #e5e5e5;">
              You are officially on the list. We will notify you the moment CS Vertex goes live on <strong>24 June 2026 at 2:11 PM IST</strong>.
            </p>
            
            <div style="margin: 40px 0; padding: 20px; background: rgba(255, 106, 0, 0.05); border-left: 3px solid #FF6A00; border-radius: 4px;">
              <p style="margin: 0; font-size: 15px; color: #FF6A00; font-weight: 600;">A new era of innovation is about to begin.</p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #aaa;">Stay tuned for something extraordinary.</p>
            </div>

            <p style="font-size: 14px; color: #888; margin-top: 40px; text-align: center; border-top: 1px solid #222; padding-top: 20px;">
              &copy; 2026 CS Vertex. All rights reserved.<br/>
              <a href="https://csvertex.com" style="color: #FF6A00; text-decoration: none;">csvertex.com</a>
            </p>
          </div>
        `
      })
    } catch (emailErr) {
      console.error('[subscribeEmail] Brevo error:', emailErr)
      // We don't fail the UI if the email fails to send (e.g. if domain isn't verified yet)
    }

    return { ok: true, message: "You're on the list! We'll notify you the moment we launch." }
  } catch (err: unknown) {
    console.error('[subscribeEmail] DB error:', err)
    return { ok: false, message: 'Something went wrong. Please try again.' }
  }
}
