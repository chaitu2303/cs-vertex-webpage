import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'



export default async function CustomerNotificationsPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/portal/login')

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  async function markAllRead() {
    'use server'
    await prisma.notification.updateMany({
      where: { userId: session!.user.id, isRead: false },
      data: { isRead: true }
    })
    revalidatePath('/portal/notifications')
    revalidatePath('/portal/layout')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notification Center</h1>
        <form action={markAllRead}>
          <button type="submit" className="btn-mark-read text-sm font-bold px-4 py-2 rounded-md transition-all duration-300 ease-in-out cursor-pointer">Mark all as read</button>
        </form>
      </div>

      <div className="space-y-4">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 rounded-xl border ${n.isRead ? 'bg-[#111] border-[#222]' : 'bg-[#1a1a1a] border-[#ff5c2a]'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#ff5c2a]"></span>}
                {n.title}
              </h3>
              <span className="text-xs text-gray-400">{n.createdAt.toLocaleString()}</span>
            </div>
            <p className="text-gray-300 text-sm">{n.message}</p>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="p-8 text-center bg-[#111] border border-[#222] rounded-xl text-gray-400">
            You have no notifications.
          </div>
        )}
      </div>
    </div>
  )
}

