import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@csvertex.com'
  const password = await bcrypt.hash('CSVertex#Admin%2026', 10)

  await prisma.admin.upsert({
    where: { email },
    update: { password, role: 'Super Admin' },
    create: { email, password, role: 'Super Admin' },
  })

  console.log('Default Admin user seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
