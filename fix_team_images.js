const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateTeam() {
  const members = await prisma.teamMember.findMany()
  
  for (const m of members) {
    let imagePath = null
    const nameStr = m.name.toLowerCase()
    if (nameStr.includes('chaitanya')) imagePath = '/assets/team/founder_chaitanya.jpg'
    else if (nameStr.includes('vasant')) imagePath = '/assets/team/founder_vasant.jpeg'
    else if (nameStr.includes('harish')) imagePath = '/assets/team/founder_harish.png'
    else if (nameStr.includes('mahendra')) imagePath = '/assets/team/founder_mahendra.jpg'
    else if (nameStr.includes('nithish')) imagePath = '/assets/team/founder_nithish.jpeg'
    else if (nameStr.includes('sateesh')) imagePath = '/assets/team/founder_sateesh.webp'

    if (imagePath) {
      await prisma.teamMember.update({
        where: { id: m.id },
        data: { image: imagePath }
      })
      console.log(`Updated ${m.name} to ${imagePath}`)
    }
  }
  console.log("Done")
}

updateTeam().catch(console.error)
