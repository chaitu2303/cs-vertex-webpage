import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { decrypt } from './lib/auth'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next()

  const { pathname } = request.nextUrl

  // ----------------------------------------------------
  // Admin Route Protection
  // ----------------------------------------------------
  if (pathname.startsWith('/admin')) {
    const isAuthPage = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/forgot-password')
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
      // Redirect unauthenticated users to login
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    if (isValidSession && isAuthPage) {
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
    const isAuthPage = pathname.startsWith('/portal/login') || pathname.startsWith('/portal/signup') || pathname.startsWith('/portal/forgot-password')
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({
              request: { headers: request.headers },
            })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({
              request: { headers: request.headers },
            })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session && !isAuthPage) {
      // Redirect to portal login
      const url = request.nextUrl.clone()
      url.pathname = '/portal/login'
      return NextResponse.redirect(url)
    }

    if (session && isAuthPage) {
      // Redirect authenticated users to portal dashboard
      const url = request.nextUrl.clone()
      url.pathname = '/portal'
      return NextResponse.redirect(url)
    }

    return response
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
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
