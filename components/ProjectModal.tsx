'use client'

import { useEffect, useState } from 'react'

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

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && project.images.length > 1) {
        setCurrentImageIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1))
      } else if (e.key === 'ArrowRight' && project.images.length > 1) {
        setCurrentImageIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, project.images.length])

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1))
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 28, 61, 0.9)', // Syracuse blue with transparency
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '2rem',
        overflowY: 'auto'
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius)',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            color: 'var(--brand2)',
            padding: '0.5rem',
            lineHeight: 1,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(5, 28, 61, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Project Title */}
        <h2 style={{ color: 'var(--brand2)', marginBottom: '0.5rem', paddingRight: '3rem' }}>
          {project.title}
        </h2>
        <p style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>{project.date}</p>

        {/* Image Gallery with Carousel */}
        {project.images.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={project.images[currentImageIndex].src}
                alt={project.images[currentImageIndex].alt}
                style={{
                  width: '100%',
                  maxWidth: '700px',
                  height: 'auto',
                  margin: '0 auto',
                  display: 'block',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--line)',
                  boxShadow: 'var(--shadow)'
                }}
              />

              {/* Carousel Navigation - only if multiple images */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid var(--line)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand2)',
                      boxShadow: 'var(--shadow)'
                    }}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNextImage}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid var(--line)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand2)',
                      boxShadow: 'var(--shadow)'
                    }}
                    aria-label="Next image"
                  >
                    ›
                  </button>

                  {/* Image Counter */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {currentImageIndex + 1} / {project.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Image Caption */}
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--brand2)',
                marginTop: '0.75rem',
                textAlign: 'center',
                fontStyle: 'italic'
              }}
            >
              {project.images[currentImageIndex].caption}
            </p>
          </div>
        )}

        {/* Tech Stack */}
        <div style={{ marginBottom: '1.5rem' }}>
          <strong style={{ color: 'var(--brand2)' }}>Tech Stack: </strong>
          {project.tech.map((tech, index) => (
            <span
              key={index}
              className="skill-chip"
              style={{
                display: 'inline-block',
                margin: '0.25rem',
                padding: '0.3rem 0.7rem',
                fontSize: '0.85rem',
                backgroundColor: 'rgba(193, 63, 3, 0.1)',
                color: 'var(--brand1)',
                border: '1px solid var(--brand1)',
                borderRadius: 'var(--radius)'
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Long Description */}
        <div
          style={{
            marginBottom: '1.5rem',
            lineHeight: 1.6,
            color: 'var(--text)'
          }}
          dangerouslySetInnerHTML={{ __html: project.longDescription }}
        />

        {/* Action Links */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {project.repoURL && (
            <a
              href={project.repoURL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ textDecoration: 'none' }}
            >
              Visit Repository
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                textDecoration: 'none',
                background: 'var(--brand1)',
                color: 'white'
              }}
            >
              Visit Live Site
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
