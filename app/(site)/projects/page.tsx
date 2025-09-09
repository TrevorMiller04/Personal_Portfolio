export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Projects</h1>
        <p className="text-xl text-muted-foreground">
          Showcasing modern web applications and data engineering solutions.
        </p>
        <div className="text-center py-16 text-muted-foreground">
          <p>Projects will be loaded from the database once the data layer is set up.</p>
        </div>
      </div>
    </div>
  );
}