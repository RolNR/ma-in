import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  // Carriers iniciales
  const carriers = [
    { name: 'MA-IN',    code: 'MAIN' },
    { name: 'Estafeta', code: 'EST' },
    { name: 'FedEx',    code: 'FEDEX' },
    { name: 'DHL',      code: 'DHL' },
    { name: 'UPS',      code: 'UPS' },
  ]

  for (const carrier of carriers) {
    await db.carrier.upsert({
      where: { code: carrier.code },
      update: {},
      create: carrier,
    })
  }

  console.log('✅ Carriers iniciales creados')

  // Usuario admin inicial
  await db.user.upsert({
    where: { email: 'admin@ma-in.mx' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@ma-in.mx',
      passwordHash: await bcrypt.hash('Admin123!', 10),
      role: 'admin',
    },
  })

  console.log('✅ Usuario admin creado (admin@ma-in.mx / Admin123!)')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
