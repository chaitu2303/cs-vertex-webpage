import { prisma } from '@/lib/prisma'
import React from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function WaitlistAdminPage() {
  const waitlist = await prisma.launchRegistration.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Waitlist & Notifications</h1>
          <p className="text-gray-400 text-sm">People who signed up to be notified when courses or internships launch.</p>
        </div>
        <div className="bg-[#111] px-4 py-2 rounded-lg border border-[#222]">
          <span className="text-gray-400 text-sm mr-2">Total Signups:</span>
          <span className="text-[#FF6B2C] font-bold">{waitlist.length}</span>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#111] border-b border-[#222]">
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {waitlist.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-8 text-center text-gray-500">
                  No waitlist signups yet.
                </td>
              </tr>
            ) : (
              waitlist.map((user) => (
                <tr key={user.id} className="hover:bg-[#111] transition-colors">
                  <td className="p-4 text-sm text-white font-medium">{user.email}</td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
