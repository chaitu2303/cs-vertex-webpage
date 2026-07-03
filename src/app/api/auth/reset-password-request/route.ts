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

    // Send the direct Supabase recovery link. When clicked, it logs the user in and redirects to /portal/reset-password
    await sendPasswordResetEmail(email, data.properties.action_link)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ success: true }) // Prevent enum attack
  }
}
