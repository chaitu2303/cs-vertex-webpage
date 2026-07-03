"use client"

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ─── Singleton client ──────────────────────────────────────────────────────
// Creating supabase inside the component body produces a new object reference
// on every render. When used in useEffect deps it triggers an infinite loop:
//   new supabase → new subscription → router.refresh() → re-render → repeat
// Solution: create the client exactly once at module scope.
let _supabase: ReturnType<typeof import('@/utils/supabase/client').createClient> | null = null
function getClient() {
  if (!_supabase) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require('@/utils/supabase/client')
    _supabase = createClient()
  }
  return _supabase!
}

export function RealtimeProvider() {
  const router = useRouter()

  // Stabilise the router reference so effects don't re-run when it changes
  const routerRef = useRef(router)
  useEffect(() => { routerRef.current = router }, [router])

  // Debounce: at most one refresh per 10 seconds
  const lastRefreshRef = useRef(0)

  useEffect(() => {
    const supabase = getClient()
    const refresh = () => {
      const now = Date.now()
      if (now - lastRefreshRef.current > 10_000) {
        lastRefreshRef.current = now
        routerRef.current.refresh()
      }
    }

    const quoteChannel = supabase
      .channel('rv-quote')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Quote' }, refresh)
      .subscribe()

    const notifChannel = supabase
      .channel('rv-notif')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Notification' }, (payload) => {
        if (payload.eventType === 'INSERT' && 'Notification' in window && Notification.permission === 'granted') {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(payload.new.title || 'New Update - CS Vertex', {
              body: payload.new.message || 'You have received a new update in your dashboard.',
              icon: '/icon.png',
              badge: '/icon.png',
              data: { url: '/portal/notifications' }
            })
          })
        }
        refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(quoteChannel)
      supabase.removeChannel(notifChannel)
    }
  }, []) // intentionally empty — refs keep values fresh

  return null
}

