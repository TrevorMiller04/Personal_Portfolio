import React from 'react'
import { Project } from '@/lib/validation'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border-l-4 border-l-syracuse-orange p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xl font-bold text-gray-900">{project.title}</h4>
        {project.featured && (
          <span className="px-2 py-1 bg-syracuse-orange text-white text-xs rounded">
            Featured
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-2">{project.role}</p>
      <p className="text-gray-500 text-xs mb-4">{project.date}</p>

      <p className="text-gray-700 mb-4 flex-1">{project.description}</p>

      {/* Technology Stack */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.techStack.map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Action Links */}
      <div className="flex gap-2 mt-auto">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
          >
            View Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-syracuse-blue text-white text-sm rounded-md hover:bg-blue-800 transition-colors"
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  )
}