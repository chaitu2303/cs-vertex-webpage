import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'



export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({
    where: { userId: 'ADMIN' },
    orderBy: { createdAt: 'desc' }
  })

  async function markAllRead() {
    'use server'
    await prisma.notification.updateMany({
      where: { userId: 'ADMIN', isRead: false },
      data: { isRead: true }
    })
    revalidatePath('/admin/notifications')
  }

  return (
    <div>
      <style>{`
        .btn-mark-read {
          background: #FFFFFF;
          color: #050505;
          border: 1px solid #E5E7EB;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
        }
        .btn-mark-read:hover {
          background: #FF6B35;
          color: #FFFFFF;
          border-color: #FF6B35;
        }
      `}</style>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Notification Center</h1>
        <form action={markAllRead}>
          <button type="submit" className="btn-mark-read">Mark all as read</button>
        </form>
      </div>

      <div className="space-y-4 max-w-4xl">
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
            No admin alerts found.
          </div>
        )}
      </div>
    </div>
  )
}

