import { PrismaClient } from '@prisma/client'
import projectsData from '../data/projects.json'
import skillsData from '../data/skills.json'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.skill.deleteMany()
  await prisma.project.deleteMany()

  // Seed projects
  console.log('📁 Seeding projects...')
  for (const project of projectsData) {
    await prisma.project.create({
      data: {
        title: project.title,
        role: project.role,
        date: project.date,
        description: project.description,
        longDescription: project.longDescription || null,
        techStack: project.tech,
        repoUrl: project.repoURL || null,
        liveUrl: null, // Add live URL to JSON data if available
        images: project.images ? JSON.parse(JSON.stringify(project.images)) : null,
        featured: true, // Mark imported projects as featured
      }
    })
  }

  // Seed skills
  console.log('🛠️ Seeding skills...')

  // Process Languages
  for (const lang of skillsData.Languages) {
    await prisma.skill.create({
      data: {
        name: lang.name,
        category: 'Languages',
        experience: lang.experience,
        proficiency: 'Advanced', // Infer proficiency level
      }
    })
  }

  // Process Frameworks
  for (const framework of skillsData.Frameworks) {
    await prisma.skill.create({
      data: {
        name: framework.name,
        category: 'Frameworks',
        experience: framework.experience,
        proficiency: framework.name === 'React' ? 'Intermediate' : 'Advanced',
      }
    })
  }

  // Process Tools/Cloud
  for (const tool of skillsData['Tools/Cloud']) {
    await prisma.skill.create({
      data: {
        name: tool.name,
        category: 'Tools/Cloud',
        experience: tool.experience,
        proficiency: 'Advanced',
      }
    })
  }

  // Process Coursework
  for (const course of skillsData.Coursework) {
    await prisma.skill.create({
      data: {
        name: course.name,
        category: 'Coursework',
        experience: course.experience,
        proficiency: 'Expert', // Academic coursework marked as expert level
      }
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })