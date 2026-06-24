import { prisma } from '@/lib/prisma'
import { CinematicLaunch } from '@/components/launch-demo/CinematicLaunch'

export const metadata = {
  title: 'CS Vertex — Grand Launch',
  description: 'CS Vertex Grand Opening Cinematic Experience',
}

export const revalidate = 0 // Disable cache for demo page to get fresh DB states

export default async function LaunchDemoPage() {
  // Fetch identical data as homepage to render the live site on reveal
  const [services, projects, team, announcements, testimonials] = await Promise.all([
    prisma.service.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    prisma.project.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    prisma.teamMember.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    prisma.announcement.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } }),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })
  ])

  // Serialize Prisma Date objects to prevent Client Component serialization errors
  const serializedData = {
    services: JSON.parse(JSON.stringify(services)),
    projects: JSON.parse(JSON.stringify(projects)),
    team: JSON.parse(JSON.stringify(team)),
    announcements: JSON.parse(JSON.stringify(announcements)),
    testimonials: JSON.parse(JSON.stringify(testimonials)),
  }

  return <CinematicLaunch initialData={serializedData} />
}
