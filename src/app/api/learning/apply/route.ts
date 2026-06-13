import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const type = formData.get('type') as string
    const itemId = formData.get('itemId') as string

    // Extract common fields
    const fullName = formData.get('fullName') as string || ''
    const email = formData.get('email') as string || ''
    const phone = formData.get('phone') as string || ''
    const college = formData.get('college') as string || ''
    const linkedin = formData.get('linkedin') as string || ''
    const github = formData.get('github') as string || ''

    // Get customer profile
    const customer = await prisma.customer.findUnique({ where: { id: user.id } })
    if (!customer) {
      return NextResponse.json({ message: 'Customer profile not found' }, { status: 404 })
    }

    if (type === 'Internships') {
      const existing = await prisma.internshipApplication.findFirst({
        where: { userId: customer.id, internshipId: itemId }
      })
      if (existing) return NextResponse.json({ message: 'Already applied' }, { status: 400 })
      
      await prisma.internshipApplication.create({
        data: {
          userId: customer.id,
          internshipId: itemId,
          fullName, email, phone, college, linkedin, github,
          branch: formData.get('branch') as string || '',
          year: formData.get('year') as string || '',
          skills: formData.get('skills') as string || '',
          resumeUrl: formData.get('resumeUrl') as string || null,
          coverLetter: formData.get('coverLetter') as string || null,
          status: 'Pending'
        }
      })
    } else if (type === 'Courses') {
      const existing = await prisma.courseRegistration.findFirst({
        where: { userId: customer.id, courseId: itemId }
      })
      if (existing) return NextResponse.json({ message: 'Already registered' }, { status: 400 })
      
      await prisma.courseRegistration.create({
        data: {
          userId: customer.id,
          courseId: itemId,
          fullName, email, phone, college, linkedin,
          qualification: formData.get('qualification') as string || '',
          status: 'Pending'
        }
      })
    } else if (type === 'Workshops') {
      const existing = await prisma.workshopRegistration.findFirst({
        where: { userId: customer.id, workshopId: itemId }
      })
      if (existing) return NextResponse.json({ message: 'Already registered' }, { status: 400 })
      
      await prisma.workshopRegistration.create({
        data: {
          userId: customer.id,
          workshopId: itemId,
          fullName, email, phone, linkedin, college,
          organization: formData.get('organization') as string || null,
          status: 'Pending'
        }
      })
    } else {
      return NextResponse.json({ message: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Apply error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
