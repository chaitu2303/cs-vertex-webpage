import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/portal/login')
  }

  const customer = await prisma.customer.findUnique({
    where: { id: user.id }
  })

  return <ProfileClient customer={customer} userEmail={user.email || ''} />
}
