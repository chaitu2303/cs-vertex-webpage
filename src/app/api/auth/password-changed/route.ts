import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { sendPasswordChangedEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Send confirmation email
    await sendPasswordChangedEmail(user.email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to trigger password changed email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
