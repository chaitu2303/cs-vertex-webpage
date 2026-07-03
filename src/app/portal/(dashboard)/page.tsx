import { getCachedUser } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'



export default async function PortalDashboard() {
  const user = await getCachedUser()
  
  if (!user) {
    redirect('/portal/login')
  }

  const customer = await prisma.customer.findUnique({
    where: { id: user.id }
  })

  const [quotes, projects, notifications] = await Promise.all([
    prisma.quote.findMany({ where: { customerId: user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.clientProject.findMany({ where: { customerId: user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 })
  ])

  return (
    <DashboardClient 
      user={user} 
      customer={customer} 
      quotes={quotes} 
      projects={projects} 
      notifications={notifications} 
    />
  )
}

