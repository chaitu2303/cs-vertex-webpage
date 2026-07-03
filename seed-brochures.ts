import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const brochuresDir = path.join(process.cwd(), 'public/assets/brochures')
  if (fs.existsSync(brochuresDir)) {
    const files = fs.readdirSync(brochuresDir).filter(f => f.match(/\.(png|jpe?g|webp|pdf)$/i))
    for (const file of files) {
      const fileUrl = `/assets/brochures/${file}`
      const existing = await prisma.announcement.findFirst({ where: { fileUrl } })
      if (!existing) {
        let title = file.replace(/\.[^/.]+$/, '').replace(/-/g, ' ').trim()
        
        await prisma.announcement.create({
          data: {
            title,
            subtitle: 'New Brochure Added',
            category: 'Brochure',
            content: `Download or view our latest brochure: ${title}.`,
            buttonText: 'View Brochure',
            fileUrl,
            published: true,
            isPinned: false
          }
        })
        console.log(`Created brochure announcement for ${file}`)
      }
    }
  }

  console.log("Brochure seeding complete.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
