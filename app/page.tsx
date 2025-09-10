export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900">
            Trevor Miller
          </h1>
          <h2 className="text-2xl text-gray-600">
            Full-Stack Developer & Data Engineer
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Modern portfolio built with Next.js 14, TypeScript, and advanced data analytics. 
            This is the MVP version to test Vercel deployment.
          </p>
          
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-500 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-green-800 font-semibold">✅ Next.js App Router Working</p>
              <p className="text-green-700 text-sm">If you see this, the deployment succeeded!</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-medium">Framework</div>
                <div className="text-gray-600">Next.js 15.5.2</div>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-medium">TypeScript</div>
                <div className="text-gray-600">Strict Mode</div>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-medium">Styling</div>
                <div className="text-gray-600">Tailwind CSS</div>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-medium">Deployment</div>
                <div className="text-gray-600">Vercel</div>
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-400">
              <p>MVP Version - No external dependencies</p>
              <p>No database • No APIs • No third-party services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}