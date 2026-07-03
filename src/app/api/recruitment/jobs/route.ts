import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const jobs = await prisma.careerPosition.findMany({
      where: { published: true, status: 'Open' },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(jobs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { careerPositionId, fullName, email, phone, location, qualification, experience, college, skills, portfolio, linkedin, github, resumeUrl, coverLetter, availability, expectedSalary } = data

    if (!careerPositionId || !fullName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const application = await prisma.jobApplication.create({
      data: {
        careerPositionId,
        fullName,
        email,
        phone,
        location,
        qualification,
        experience,
        college,
        skills,
        portfolio,
        linkedin,
        github,
        resumeUrl,
        coverLetter,
        availability,
        expectedSalary
      }
    })

    return NextResponse.json({ success: true, application })
  } catch (error) {
    console.error('Job Application Error:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
