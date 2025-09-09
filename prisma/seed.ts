import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create tech tags
  const techTags = await Promise.all([
    prisma.techTag.upsert({
      where: { name: 'Next.js 14' },
      update: {},
      create: { name: 'Next.js 14' },
    }),
    prisma.techTag.upsert({
      where: { name: 'TypeScript' },
      update: {},
      create: { name: 'TypeScript' },
    }),
    prisma.techTag.upsert({
      where: { name: 'Prisma' },
      update: {},
      create: { name: 'Prisma' },
    }),
    prisma.techTag.upsert({
      where: { name: 'DuckDB' },
      update: {},
      create: { name: 'DuckDB' },
    }),
    prisma.techTag.upsert({
      where: { name: 'Polars' },
      update: {},
      create: { name: 'Polars' },
    }),
    prisma.techTag.upsert({
      where: { name: 'dbt' },
      update: {},
      create: { name: 'dbt' },
    }),
    prisma.techTag.upsert({
      where: { name: 'Supabase' },
      update: {},
      create: { name: 'Supabase' },
    }),
    prisma.techTag.upsert({
      where: { name: 'Vercel' },
      update: {},
      create: { name: 'Vercel' },
    }),
    prisma.techTag.upsert({
      where: { name: 'TanStack Query' },
      update: {},
      create: { name: 'TanStack Query' },
    }),
    prisma.techTag.upsert({
      where: { name: 'Tailwind CSS' },
      update: {},
      create: { name: 'Tailwind CSS' },
    }),
  ])

  console.log('✅ Created tech tags:', techTags.length)

  // Create sample projects
  const project1 = await prisma.project.upsert({
    where: { id: 'portfolio-v2' },
    update: {},
    create: {
      id: 'portfolio-v2',
      title: 'Advanced Portfolio Website',
      summary: 'Modern portfolio built with Next.js 14, TypeScript, and advanced data analytics features including dbt transformations and interactive data stories.',
      repoUrl: 'https://github.com/TrevorMiller04/Personal_Portfolio',
      demoUrl: 'https://trevormiller.xyz',
      impactMetric: '95+ Lighthouse Score',
      technologies: {
        create: [
          { techId: techTags.find(t => t.name === 'Next.js 14')!.id },
          { techId: techTags.find(t => t.name === 'TypeScript')!.id },
          { techId: techTags.find(t => t.name === 'Tailwind CSS')!.id },
          { techId: techTags.find(t => t.name === 'Prisma')!.id },
          { techId: techTags.find(t => t.name === 'Supabase')!.id },
        ],
      },
    },
  })

  const project2 = await prisma.project.upsert({
    where: { id: 'data-pipeline' },
    update: {},
    create: {
      id: 'data-pipeline',
      title: 'Analytics Data Pipeline',
      summary: 'Production-ready data pipeline using dbt for transformations, DuckDB for analytics queries, and automated testing and documentation.',
      repoUrl: 'https://github.com/TrevorMiller04/data-pipeline',
      impactMetric: '10x faster query performance',
      technologies: {
        create: [
          { techId: techTags.find(t => t.name === 'dbt')!.id },
          { techId: techTags.find(t => t.name === 'DuckDB')!.id },
          { techId: techTags.find(t => t.name === 'Polars')!.id },
        ],
      },
    },
  })

  const project3 = await prisma.project.upsert({
    where: { id: 'react-dashboard' },
    update: {},
    create: {
      id: 'react-dashboard',
      title: 'Real-time Analytics Dashboard',
      summary: 'Interactive dashboard with real-time data visualization, built with modern React patterns and optimized for performance.',
      repoUrl: 'https://github.com/TrevorMiller04/react-dashboard',
      demoUrl: 'https://dashboard.trevormiller.xyz',
      impactMetric: '50ms avg response time',
      technologies: {
        create: [
          { techId: techTags.find(t => t.name === 'Next.js 14')!.id },
          { techId: techTags.find(t => t.name === 'TanStack Query')!.id },
          { techId: techTags.find(t => t.name === 'TypeScript')!.id },
        ],
      },
    },
  })

  console.log('✅ Created projects:', [project1, project2, project3].map(p => p.title))

  // Create metrics
  const metrics = await Promise.all([
    prisma.metric.upsert({
      where: { name: 'projects_completed' },
      update: {},
      create: { name: 'projects_completed', value: '3' },
    }),
    prisma.metric.upsert({
      where: { name: 'technologies_mastered' },
      update: {},
      create: { name: 'technologies_mastered', value: '10+' },
    }),
    prisma.metric.upsert({
      where: { name: 'years_experience' },
      update: {},
      create: { name: 'years_experience', value: '2+' },
    }),
  ])

  console.log('✅ Created metrics:', metrics.length)
  console.log('🎉 Database seeded successfully!')
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