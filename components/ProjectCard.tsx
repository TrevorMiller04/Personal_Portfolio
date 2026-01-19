'use client'

import React, { useState } from 'react'
import { ProjectModal } from './ProjectModal'

interface ProjectImage {
  src: string
  alt: string
  caption: string
}

interface Project {
  id: string
  title: string
  date: string
  description: string
  longDescription: string | null
  techStack: string[]
  repoUrl: string | null
  liveUrl: string | null
  images: ProjectImage[]
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showModal, setShowModal] = useState(false)

  const handleViewProject = () => {
    // Always show modal if there's content to display (longDescription or images)
    if (project.longDescription || project.images.length > 0) {
      setShowModal(true)
    } else if (project.liveUrl) {
      // Only redirect if no modal content but has a live URL
      window.open(project.liveUrl, '_blank')
    }
  }

  // Determine if we should show the View Project button
  // Show for all projects with detailed descriptions
  const hasViewableContent = project.liveUrl || project.images.length > 0 || project.longDescription

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border-l-4 border-l-syracuse-orange p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-xl font-bold text-gray-900">{project.title}</h4>
        </div>

        <p className="text-gray-500 text-sm mb-4">{project.date}</p>

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
              Visit Repo
            </a>
          )}
          {hasViewableContent && (
            <button
              onClick={handleViewProject}
              className="px-4 py-2 bg-syracuse-orange text-white text-sm rounded-md hover:bg-orange-600 transition-colors"
            >
              View Project
            </button>
          )}
        </div>
      </div>

      {/* Project Modal */}
      {showModal && (
        <ProjectModal
          project={{
            title: project.title,
            date: project.date,
            description: project.description,
            tech: project.techStack,
            repoURL: project.repoUrl || undefined,
            liveUrl: project.liveUrl || undefined,
            longDescription: project.longDescription || '',
            images: project.images
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
