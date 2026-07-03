import { getCachedUser } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import RequestProjectClient from './RequestProjectClient'

export default async function RequestProjectPage() {
  const user = await getCachedUser()
  
  if (!user) {
    redirect('/portal/login')
  }

  const customer = await prisma.customer.findUnique({
    where: { id: user.id }
  })

  return <RequestProjectClient customer={customer} userEmail={user.email || ''} />
}
