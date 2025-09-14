import projectsData from '@/data/projects.json'

interface Project {
  title: string;
  role: string;
  date: string;
  description: string;
  tech: string[];
  repoURL: string;
  longDescription: string;
  images: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
}

export function ProjectsSection() {
  const projects = projectsData as Project[]

  return (
    <section id="projects" className="section">
      <h2>Projects</h2>
      <div className="grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h3 style={{ color: 'var(--brand2)', marginBottom: '0.5rem' }}>{project.title}</h3>
            <p style={{ color: 'var(--accent)', fontWeight: 500, marginBottom: '1rem' }}>
              {project.role} • {project.date}
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

            {/* Long Description */}
            <div 
              style={{ marginBottom: '1rem', lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: project.longDescription }}
            />

            {/* Project Images */}
            {project.images && project.images.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                {project.images.map((image, imgIndex) => (
                  <div key={imgIndex} style={{ marginBottom: '1rem' }}>
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        height: 'auto',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--line)',
                        boxShadow: 'var(--shadow)'
                      }}
                    />
                    <p style={{ 
                      fontSize: '0.9rem', 
                      color: 'var(--brand2)', 
                      marginTop: '0.5rem',
                      textAlign: 'center',
                      fontStyle: 'italic'
                    }}>
                      {image.caption}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Repository Link */}
            <div>
              <a 
                href={project.repoURL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn"
                style={{ textDecoration: 'none' }}
              >
                View Repository
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}