// Import components and data
import { ProjectCard } from '@/components/ProjectCard'
import projectsData from '../data/projects.json'

// Define project interface for JSON data
interface ProjectData {
  title: string
  role: string
  date: string
  description: string
  tech: string[]
  repoURL: string
  longDescription?: string
  images?: Array<{
    src: string
    alt: string
    caption: string
  }>
}

// Transform JSON data to match our Project schema
async function getProjects() {
  const transformedProjects = projectsData.map((project: ProjectData) => ({
    id: `project-${Date.now()}-${Math.random()}`, // Temporary ID for static data
    title: project.title,
    role: project.role,
    date: project.date,
    description: project.description,
    longDescription: project.longDescription || null,
    techStack: project.tech,
    repoUrl: project.repoURL || null,
    liveUrl: null,
    images: project.images || null,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }))

  return transformedProjects
}

export default async function HomePage() {
  const projects = await getProjects();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl text-gray-900">
              Trevor Miller
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-gray-900 font-medium">
                Home
              </a>
              <a href="#projects" className="text-gray-700 hover:text-gray-900 font-medium">
                Projects
              </a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900 font-medium">
                Contact
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/resume.pdf" target="_blank" 
                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Resume
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section id="home" className="text-center mb-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Trevor Miller
            </h1>
            <h2 className="text-xl sm:text-2xl text-gray-600 mb-8">
              Full-Stack Developer & Data Engineer
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              Junior CS Major at Syracuse University with expertise in modern web development, 
              data analytics, and AI integration. Building impactful software solutions with 
              React, Next.js, Python, and cloud technologies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#projects"
                 className="px-6 py-3 bg-syracuse-blue text-white font-medium rounded-md hover:bg-blue-800">
                View Projects
              </a>
              <a href="#contact" 
                 className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50">
                Contact Me
              </a>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="mb-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">Featured Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Get In Touch</h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              I'm always interested in new opportunities, collaborations, and interesting projects.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:trmille3@syr.edu"
                 className="px-6 py-3 bg-syracuse-blue text-white font-medium rounded-md hover:bg-blue-800">
                Email Me
              </a>
              <a href="https://linkedin.com/in/trevor-miller04" target="_blank" 
                 className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50">
                LinkedIn
              </a>
              <a href="https://github.com/TrevorMiller04" target="_blank" 
                 className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50">
                GitHub
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 Trevor Miller. Built with Next.js 14 & TypeScript.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}