import { prisma } from '@/lib/prisma'
import CoursesClient from './CoursesClient'

export const revalidate = 0

export default async function CoursesAdminPage() {
  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } })
  return <CoursesClient initialCourses={courses} />
}
