import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const internships = await prisma.internship.findMany({
      where: { published: true, status: 'Open' },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(internships)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { internshipId, fullName, email, phone, college, degree, branch, currentYear, cgpa, preferredDomain, internshipMode, duration, availabilityDate, whyJoin, skills, linkedin, github, portfolio, resumeUrl, coverLetter } = data

    if (!internshipId || !fullName || !email || !phone || !college) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const application = await prisma.internshipApplication.create({
      data: {
        internshipId,
        fullName,
        email,
        phone,
        college,
        degree,
        branch,
        currentYear,
        cgpa,
        preferredDomain,
        internshipMode,
        duration,
        availabilityDate,
        whyJoin,
        skills,
        linkedin,
        github,
        portfolio,
        resumeUrl,
        coverLetter
      }
    })

    return NextResponse.json({ success: true, application })
  } catch (error) {
    console.error('Internship Application Error:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
