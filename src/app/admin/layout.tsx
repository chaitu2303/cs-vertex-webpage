import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminLayoutClient from './AdminLayoutClient'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const hasSession = !!cookieStore.get('admin_session')?.value

  return (
    <AdminLayoutClient hasSession={hasSession}>
      {children}
    </AdminLayoutClient>
  )
}
