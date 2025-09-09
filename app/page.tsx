import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Full-Stack Developer &amp; Data Engineer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Building modern web applications with TypeScript, Next.js, and advanced data analytics pipelines.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/projects">View Projects</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/data-stories">Data Stories</Link>
          </Button>
        </div>
      </section>

      {/* Skills Preview */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Technical Stack</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Frontend</CardTitle>
              <CardDescription>Modern web interfaces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Next.js 14", "TypeScript", "React", "Tailwind CSS"].map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Backend & Data</CardTitle>
              <CardDescription>Scalable server solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Prisma", "Supabase", "dbt", "DuckDB", "Polars"].map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>DevOps & Quality</CardTitle>
              <CardDescription>Production-ready workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["GitHub Actions", "Vitest", "Playwright", "Sentry"].map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}