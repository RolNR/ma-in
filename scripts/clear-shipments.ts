import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  const [ci, se, s] = await Promise.all([
    db.csvImport.deleteMany({}),
    db.shipmentEvent.deleteMany({}),
    db.shipment.deleteMany({}),
  ])
  console.log('csvImports borrados:', ci.count)
  console.log('eventos borrados:', se.count)
  console.log('guías borradas:', s.count)
}

main().catch(console.error).finally(() => db.$disconnect())
