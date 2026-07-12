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
      if (error.message?.includes('valid Bearer token')) {
         console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY missing or invalid in production.')
      }
      // Return a safe generic error instead of false success if the backend is fundamentally broken
      return NextResponse.json({ error: 'System configuration error. Please contact support.' }, { status: 500 })
    }

    // Send the direct Supabase recovery link. When clicked, it logs the user in and redirects to /portal/reset-password
    await sendPasswordResetEmail(email, data.properties.action_link)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Password reset error:', error.message || error)
    return NextResponse.json({ error: 'System misconfiguration. Reset failed.' }, { status: 500 }) 
  }
}
