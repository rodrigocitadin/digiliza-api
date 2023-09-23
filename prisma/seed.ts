import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  for (let i = 0; i < 5; i++) {
    await prisma.table.createMany({
      data: [
        { capacity: 4 },
        { capacity: 6 },
      ]
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
