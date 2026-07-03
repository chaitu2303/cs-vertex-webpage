import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  // 1. Seed Projects
  const projectsDir = path.join(process.cwd(), 'public/assets/projects')
  if (fs.existsSync(projectsDir)) {
    const files = fs.readdirSync(projectsDir).filter(f => f.match(/\.(png|jpe?g|webp)$/i))
    for (const file of files) {
      const imageUrl = `/assets/projects/${file}`
      const existing = await prisma.project.findFirst({ where: { image: imageUrl } })
      if (!existing) {
        let title = file.replace(/\.[^/.]+$/, '').replace(/-/g, ' ')
        title = title.replace('project ', '').trim()
        
        // Capitalize words
        title = title.replace(/\b\w/g, c => c.toUpperCase())

        let category = 'Web'
        if (title.toLowerCase().includes('robot') || title.toLowerCase().includes('lpg') || title.toLowerCase().includes('gloves') || title.toLowerCase().includes('glasses')) {
          category = 'IoT / Embedded / Robotics'
        }
        
        await prisma.project.create({
          data: {
            title,
            image: imageUrl,
            challenge: 'Details coming soon...',
            solution: 'Details coming soon...',
            technologies: 'Tech stack coming soon...',
            impact: 'Impact coming soon...',
            category,
            published: true,
            order: 99
          }
        })
        console.log(`Created project for ${file}`)
      }
    }
  }

  // 2. Seed Team
  const teamMap = {
    'founder_chaitanya.jpg': 'V Chaitanya',
    'founder_harish.jpeg': 'Harish',
    'founder_mahendra.jpg': 'Kalla Mahendra Nadh',
    'founder_nithish.jpeg': 'Nithish',
    'founder_sateesh2.jpeg': 'Sateesh',
    'founder_vasant_v2.jpeg': 'Vasant'
  }

  for (const [file, name] of Object.entries(teamMap)) {
    const imageUrl = `/assets/team/${file}`
    const existing = await prisma.teamMember.findFirst({ where: { image: imageUrl } })
    if (!existing) {
      // Create it
      await prisma.teamMember.create({
        data: {
          name,
          role: 'Founder / Team Member',
          bio: 'Details coming soon...',
          image: imageUrl,
          published: true,
          order: 99
        }
      })
      console.log(`Created team member for ${file}`)
    } else {
      // Update name to make sure it's Kalla Mahendra Nadh
      if (name === 'Kalla Mahendra Nadh' && existing.name !== name) {
        await prisma.teamMember.update({
          where: { id: existing.id },
          data: { name }
        })
        console.log(`Updated team member name to ${name}`)
      }
    }
  }

  console.log("Seeding complete.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
