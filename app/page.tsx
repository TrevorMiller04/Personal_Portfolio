export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900">Trevor Miller</h1>
          <h2 className="text-2xl text-gray-600">Full-Stack Developer & Data Engineer</h2>
          <div className="bg-green-100 border border-green-500 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-green-800 font-semibold"> Next.js App Router Working</p>
            <p className="text-green-700 text-sm">If you see this, the deployment succeeded!</p>
          </div>
        </div>
      </div>
    </div>
  );
}