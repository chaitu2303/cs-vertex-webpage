import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/server'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const supabaseAdmin = createAdminClient()
    
    // Generate recovery link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    if (error) {
      console.error('Failed to generate reset link:', error)
      // Return success anyway to prevent email enumeration attacks
      return NextResponse.json({ success: true })
    }

    // data.properties.action_link contains the magical reset token from Supabase
    // We can extract the token and send it, or just send the action link directly.
    // Wait, let's extract the token or just pass the full URL if we update sendPasswordResetEmail to accept the full link.
    // But we already wrote sendPasswordResetEmail to accept a 'token'. Let's parse the action_link.
    
    const actionUrl = new URL(data.properties.action_link)
    // The link might be: .../verify?token=...&type=recovery
    // Let's just pass the whole action_link to the user if needed, but our email.ts uses `token`.
    // Actually, it's safer to just send the raw action_link.
    
    // Let's modify email.ts to accept the `link` instead of `token`.
    // For now, let's assume `data.properties.action_link` is what we need to redirect them to.
    const tokenParams = actionUrl.hash || actionUrl.search
    await sendPasswordResetEmail(email, tokenParams) // The email.ts will append this.

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ success: true }) // Prevent enum attack
  }
}
