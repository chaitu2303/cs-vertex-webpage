import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function resetDB() {
  console.log("Resetting DB collections...")
  
  // Wipe everything in these tables
  await prisma.project.deleteMany({})
  await prisma.teamMember.deleteMany({})
  await prisma.announcement.deleteMany({})

  console.log("Cleared Projects, TeamMembers, Announcements.")
  
  // Now we can use seed-missing to repopulate safely without duplicates.
}

resetDB()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
