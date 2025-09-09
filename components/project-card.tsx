// import Link from 'next/link' // Unused for now
import { ExternalLink, Github } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ApiProject } from '@/lib/validation'

interface ProjectCardProps {
  project: ApiProject
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{project.title}</CardTitle>
        {project.impactMetric && (
          <CardDescription className="text-primary font-medium">
            {project.impactMetric}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">
          {project.summary}
        </p>
        
        {/* Tech Stack */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span className="px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-md text-xs">
                  +{project.technologies.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          {project.repoUrl && (
            <Button asChild size="sm" variant="outline" className="flex-1">
              <a 
                href={project.repoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                Code
              </a>
            </Button>
          )}
          {project.demoUrl && (
            <Button asChild size="sm" className="flex-1">
              <a 
                href={project.demoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Demo
              </a>
            </Button>
          )}
          {!project.repoUrl && !project.demoUrl && (
            <Button size="sm" variant="outline" disabled className="flex-1">
              Coming Soon
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}