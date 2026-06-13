"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function RealtimeProvider() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to all changes in the Quote table
    const quoteChannel = supabase.channel('custom-quote-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Quote' },
        (payload) => {
          console.log('Quote changed:', payload)
          router.refresh()
        }
      )
      .subscribe()

    // Subscribe to all changes in the Notification table
    const notificationChannel = supabase.channel('custom-notification-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Notification' },
        (payload) => {
          console.log('Notification changed:', payload)
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(quoteChannel)
      supabase.removeChannel(notificationChannel)
    }
  }, [router, supabase])

  return null
}
