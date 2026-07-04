import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'



export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/portal'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Create user profile in Prisma if it doesn't exist
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        try {
          const existing = await prisma.customer.findUnique({
            where: { id: user.id }
          })
          
          if (!existing) {
            await prisma.customer.create({
              data: {
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.full_name || user.email?.split('@')[0],
              }
            })
            // New user verified their email or logged in via OAuth for the first time
            await sendWelcomeEmail(user.email!)
          }
        } catch (e) {
          console.error('Error syncing user to Prisma on auth callback', e)
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/portal/login?error=Could not authenticate with Google`)
}

