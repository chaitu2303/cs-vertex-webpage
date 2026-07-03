import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Cleaning up duplicates...")
  
  // 1. Clean up duplicated projects based on title
  const projects = await prisma.project.findMany()
  const seenProjects = new Set()
  for (const p of projects) {
    const key = p.title.toLowerCase().trim()
    if (seenProjects.has(key)) {
      await prisma.project.delete({ where: { id: p.id } })
      console.log("Deleted duplicate project:", p.title)
    } else {
      seenProjects.add(key)
    }
  }

  // 2. Clean up duplicated team members based on name
  const team = await prisma.teamMember.findMany()
  const seenTeam = new Set()
  for (const t of team) {
    const key = t.name.toLowerCase().trim()
    if (seenTeam.has(key)) {
      await prisma.teamMember.delete({ where: { id: t.id } })
      console.log("Deleted duplicate team member:", t.name)
    } else {
      seenTeam.add(key)
    }
  }

  // 3. Clean up duplicated announcements based on title
  const announcements = await prisma.announcement.findMany()
  const seenAnn = new Set()
  for (const a of announcements) {
    if (!a.title) continue;
    const key = a.title.toLowerCase().trim()
    if (seenAnn.has(key)) {
      await prisma.announcement.delete({ where: { id: a.id } })
      console.log("Deleted duplicate announcement:", a.title)
    } else {
      seenAnn.add(key)
    }
  }

  console.log("Cleanup finished.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
