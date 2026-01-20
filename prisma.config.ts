import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts'
  },
  datasource: {
    // Use DATABASE_URL if available, otherwise use a dummy URL for prisma generate
    // (prisma generate doesn't actually connect to the database)
    url: process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy'
  }
})
