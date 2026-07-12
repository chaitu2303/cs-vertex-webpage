import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { decrypt } from './lib/auth'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  const { pathname } = request.nextUrl

  // ----------------------------------------------------
  // Admin Route Protection
  // ----------------------------------------------------
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const isAuthPage = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/forgot-password') || pathname.startsWith('/api/admin/login')
    const adminSession = request.cookies.get('admin_session')?.value
    let isValidSession = false

    if (adminSession) {
      try {
        const payload = await decrypt(adminSession)
        if (payload && payload.id) {
          isValidSession = true
        }
      } catch (err) {
        // Invalid or expired token
      }
    }

    if (!isValidSession && !isAuthPage) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      // Redirect unauthenticated users to login
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    if (isValidSession && isAuthPage) {
      if (pathname.startsWith('/api/')) {
         return response
      }
      // Redirect authenticated users away from login
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }

    return response
  }

  // ----------------------------------------------------
  // Customer Portal Route Protection
  // ----------------------------------------------------
  if (pathname.startsWith('/portal')) {
    const isAuthPage = 
      pathname.startsWith('/portal/login') || 
      pathname.startsWith('/portal/signup') || 
      pathname.startsWith('/portal/forgot-password') ||
      pathname.startsWith('/portal/reset-password')

    // Create a response we can mutate for cookie updates
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // Write cookies to the request so server components can read them
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            // Re-create response with updated request headers
            supabaseResponse = NextResponse.next({ request })
            // Write cookies to the response so the browser gets them
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // IMPORTANT: use getUser() not getSession() to avoid stale cached data
    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !isAuthPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/portal/login'
      const redirectResponse = NextResponse.redirect(url)
      // Forward any updated cookies to the redirect response
      supabaseResponse.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      })
      return redirectResponse
    }

    if (user && isAuthPage) {
      // EXCEPTION: If the user is on the reset-password page, do NOT redirect them to the portal.
      // They might be processing a recovery token from an email while already having a stale session.
      if (!pathname.startsWith('/portal/reset-password')) {
        const url = request.nextUrl.clone()
        url.pathname = '/portal'
        const redirectResponse = NextResponse.redirect(url)
        supabaseResponse.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
        })
        return redirectResponse
      }
    }

    return supabaseResponse
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes, unless we specifically want to protect them here)
     * - assets, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
