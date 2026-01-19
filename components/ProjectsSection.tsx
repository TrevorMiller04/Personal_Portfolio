'use client'

import { useState } from 'react'
import projectsData from '@/data/projects.json'
import { ProjectModal } from './ProjectModal'

interface Project {
  title: string;
  date: string;
  description: string;
  tech: string[];
  repoURL?: string;
  liveUrl?: string;
  longDescription: string;
  images: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
}

export function ProjectsSection() {
  const projects = projectsData as Project[]
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
  }

  const handleCloseModal = () => {
    setSelectedProject(null)
  }

  return (
    <section id="projects" className="section">
      <h2>Projects</h2>
      <div className="grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h3 style={{ color: 'var(--brand2)', marginBottom: '0.5rem' }}>{project.title}</h3>
            <p style={{ color: 'var(--accent)', fontWeight: 500, marginBottom: '1rem' }}>
              {project.date}
            </p>
            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>{project.description}</p>

            {/* Tech Stack */}
            <div style={{ marginBottom: '1rem' }}>
              <strong>Tech Stack: </strong>
              {project.tech.map((tech, techIndex) => (
                <span key={techIndex}>
                  <span className="skill-chip" style={{
                    display: 'inline',
                    margin: '0 0.25rem 0 0',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.8rem'
                  }}>
                    {tech}
                  </span>
                  {techIndex < project.tech.length - 1 ? ' ' : ''}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Visit Repo Button - only if repoURL exists */}
              {project.repoURL && (
                <a
                  href={project.repoURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ textDecoration: 'none' }}
                >
                  Visit Repo
                </a>
              )}

              {/* View Project Button - if has liveUrl OR has images */}
              {(project.liveUrl || project.images.length > 0) && (
                <button
                  onClick={() => handleViewProject(project)}
                  className="btn"
                  style={{
                    background: 'var(--brand1)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  View Project
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </section>
  )
}
