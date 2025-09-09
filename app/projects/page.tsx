'use client'

import { ProjectCard } from '@/components/project-card'
import { useProjects } from '@/lib/hooks/use-projects'
import { Loader2 } from 'lucide-react'

export default function ProjectsPage() {
  const { data, isLoading, error } = useProjects({ limit: 12 })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Showcasing modern web applications, data engineering solutions, and full-stack development projects built with cutting-edge technologies.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading projects...
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-destructive">
              Failed to load projects. Please try again later.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {error.message}
            </p>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {data.total > 0 && (
              <p className="text-sm text-muted-foreground">
                Showing {data.projects.length} of {data.total} projects
              </p>
            )}
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            {data.projects.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p>No projects found. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}