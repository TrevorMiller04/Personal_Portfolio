// Import components and data
import { ProjectCard } from '../components/ProjectCard'
import { SkillsSection } from '../components/SkillsSection'
import { ResumeSection } from '../components/ResumeSection'
import { ContactForm } from '../components/ContactForm'
import projectsData from '../data/projects.json'

// Define project interface for JSON data
interface ProjectData {
  title: string
  date: string
  description: string
  tech: string[]
  repoURL?: string
  liveUrl?: string
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
    date: project.date,
    description: project.description,
    longDescription: project.longDescription || null,
    techStack: project.tech,
    repoUrl: project.repoURL || null,
    liveUrl: project.liveUrl || null,
    images: project.images || [],
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
              <a href="#skills" className="text-gray-700 hover:text-gray-900 font-medium">
                Skills
              </a>
              <a href="#resume" className="text-gray-700 hover:text-gray-900 font-medium">
                Resume
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
      <div>
        {/* Hero Section with Syracuse Background */}
        <section
          id="home"
          className="relative min-h-screen flex items-center justify-center"
          style={{
            backgroundImage: 'url(/campus.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Background overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Hero Content */}
          <div className="relative z-10 text-center text-white px-8 py-16">
            <div className="max-w-4xl mx-auto">
              {/* Profile Image */}
              <div className="mb-8 flex justify-center">
                <img
                  src="/headshot2.png"
                  alt="Trevor Miller"
                  className="w-48 h-48 rounded-full shadow-2xl border-4 border-white object-cover"
                  style={{ objectPosition: 'center 25%' }}
                />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Trevor Miller
              </h1>
              <h2 className="text-xl sm:text-2xl mb-8 text-gray-100">
                Junior CS Major @ Syracuse University
              </h2>
              <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-100 leading-relaxed">
                Junior at Syracuse University studying Computer Science with minors in Statistics and Management, graduating December 2026.
                Passionate about applying math and programming to real-world problems, especially in data science and AI/ML.
                Seven years of professional experience with leadership roles in both academic and professional settings.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#projects"
                   className="px-6 py-3 bg-syracuse-orange text-white font-medium rounded-md hover:bg-orange-600 transition-colors duration-200">
                  View Projects
                </a>
                <a href="#contact"
                   className="px-6 py-3 border-2 border-white text-white font-medium rounded-md hover:bg-white hover:text-gray-900 transition-colors duration-200">
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="px-8 py-16">
          <div className="max-w-6xl mx-auto">

          {/* Projects Section */}
          <section id="projects" className="mb-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <SkillsSection />

          {/* Resume Section */}
          <ResumeSection />

          {/* Contact Section */}
          <ContactForm />
          </div>
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