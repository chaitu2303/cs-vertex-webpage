import { ReactNode } from 'react'
import { getCachedUser } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PortalShell } from '@/components/PortalShell'
import { prisma } from '@/lib/prisma'

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const user = await getCachedUser()

  if (!user) {
    redirect('/portal/login')
  }

  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, isRead: false }
  })

  return (
    <PortalShell userEmail={user.email ?? 'User'} initialUnreadCount={unreadCount}>
      {children}
    </PortalShell>
  )
}
