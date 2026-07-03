import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { encrypt } from '@/lib/auth'



export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    console.log("DEBUG [Admin Login Request]:", { email: normalizedEmail, passwordLength: password.length })

    const FIXED_ADMIN_EMAIL = "admin@csvertex.com"
    const FIXED_ADMIN_PASSWORD = "CSVertex#Admin%2026"

    const admin = await prisma.admin.findUnique({ where: { email: normalizedEmail } })

    let isValid = false
    let role = 'Super Admin'
    let adminId = 'fixed-admin-id'

    if (normalizedEmail === FIXED_ADMIN_EMAIL && password === FIXED_ADMIN_PASSWORD) {
      isValid = true
      if (admin) {
        adminId = admin.id
        role = admin.role
      }
    } else if (admin) {
      isValid = await bcrypt.compare(password, admin.password)
      if (isValid) {
        adminId = admin.id
        role = admin.role
      }
    }

    console.log("DEBUG [Admin Login Status]:", { isValid, role })

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Generate JWT
    const session = await encrypt({ id: adminId, email, role })

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

