import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ProjectQuerySchema, ProjectsApiResponseSchema, EnvSchema } from '@/lib/validation'
import { z } from 'zod'

// Validate environment variables on startup
const env = EnvSchema.pick({
  DATABASE_URL: true,
  SUPABASE_URL: true,
  SUPABASE_SERVICE_ROLE_KEY: true,
}).parse(process.env)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const query = ProjectQuerySchema.parse({
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'), 
      search: searchParams.get('search'),
      tech: searchParams.get('tech'),
    })

    // Build where clause
    const where = {
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { summary: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
      ...(query.tech && {
        technologies: {
          some: {
            tech: {
              name: { contains: query.tech, mode: 'insensitive' as const }
            }
          }
        }
      }),
    }

    // Fetch projects with technologies
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          technologies: {
            include: {
              tech: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: query.limit,
        skip: query.offset,
      }),
      prisma.project.count({ where }),
    ])

    // Transform data for API response
    const apiProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      summary: project.summary,
      repoUrl: project.repoUrl,
      demoUrl: project.demoUrl,
      impactMetric: project.impactMetric,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      technologies: project.technologies.map(pt => pt.tech.name),
    }))

    const response = ProjectsApiResponseSchema.parse({
      projects: apiProjects,
      total,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Projects API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}