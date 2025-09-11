import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";

export default function Page() {
  const buildTime = new Date().toISOString();
  const featuredProjects = projectsData.filter(project => project.featured);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Trevor Miller
          </h1>
          <h2 className="text-xl sm:text-2xl text-gray-600 mb-8">
            Full-Stack Developer & Data Engineer
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="default" size="lg">
              View Resume
            </Button>
            <Button variant="outline" size="lg">
              Contact Me
            </Button>
          </div>
        </header>

        {/* Featured Projects */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.role} • {project.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {project.repoUrl && (
                      <Button variant="outline" size="sm">
                        View Code
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button variant="outline" size="sm">
                        Live Demo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Technical Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillsData.languages.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frameworks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillsData.frameworks.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillsData.tools.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coursework</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillsData.coursework.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Status Cards */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle>🚀 Deployment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 font-medium mb-2">
                  ✅ Next.js App Router Working
                </p>
                <p className="text-sm text-gray-600">
                  Vercel deployment successful
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle>⚡ Feature Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600 font-medium mb-2">
                  Phase 2: Components & Data
                </p>
                <p className="text-sm text-gray-600">
                  Enhanced with UI components and project data
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Debug Information */}
        <Card className="debug-box">
          <CardHeader>
            <CardTitle className="text-cyan-300">🔧 Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <p><span className="text-blue-300">Build Time:</span> {buildTime}</p>
              <p><span className="text-blue-300">Phase:</span> 2 - Components & Data Integration</p>
              <p><span className="text-blue-300">Components:</span> <span className="text-yellow-400">Card, Badge, Button</span></p>
              <p><span className="text-blue-300">Data Sources:</span> Projects JSON, Skills JSON</p>
              <p><span className="text-blue-300">Next:</span> Add Database Layer & Advanced Features</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}