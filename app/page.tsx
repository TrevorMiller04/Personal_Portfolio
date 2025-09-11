export default function Page() {
  const buildTime = new Date().toISOString();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Trevor Miller
          </h1>
          <h2 className="text-xl sm:text-2xl text-gray-600 mb-8">
            Full-Stack Developer & Data Engineer
          </h2>
        </header>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Deployment Status */}
          <div className="card border-l-green-500">
            <h3 className="card-title">
              🚀 Deployment Status
            </h3>
            <p className="text-green-700 font-medium mb-2">
              ✅ Next.js App Router Working
            </p>
            <p className="text-sm text-gray-600">
              Vercel deployment successful
            </p>
          </div>

          {/* Feature Progress */}
          <div className="card border-l-blue-600">
            <h3 className="card-title">
              ⚡ Feature Progress
            </h3>
            <p className="text-blue-600 font-medium mb-2">
              Phase 1b: Tailwind Integration
            </p>
            <p className="text-sm text-gray-600">
              Enhanced with Tailwind CSS classes & utilities
            </p>
          </div>
        </div>

        {/* Debug Information */}
        <div className="debug-box">
          <h3 className="text-cyan-300 font-bold mb-3">
            🔧 Debug Information
          </h3>
          <div className="flex flex-col gap-1">
            <p><span className="text-blue-300">Build Time:</span> {buildTime}</p>
            <p><span className="text-blue-300">Phase:</span> 1b - Tailwind CSS Integration</p>
            <p><span className="text-blue-300">CSS Processing:</span> <span className="text-yellow-400">Enabled</span></p>
            <p><span className="text-blue-300">Features:</span> Tailwind Utilities, Custom Classes, Responsive Design</p>
            <p><span className="text-blue-300">Next:</span> Add Components & Project Data</p>
          </div>
        </div>
      </div>
    </div>
  );
}