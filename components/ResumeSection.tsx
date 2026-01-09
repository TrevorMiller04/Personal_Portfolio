'use client'

import dynamic from 'next/dynamic'

const PDFViewer = dynamic(() => import('./PDFViewer').then(mod => ({ default: mod.PDFViewer })), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-syracuse-orange mx-auto mb-4"></div>
      <p className="text-gray-600">Loading PDF viewer...</p>
    </div>
  ),
})

export function ResumeSection() {
  return (
    <section id="resume" className="mb-20">
      <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">Resume</h3>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <a
            href="/resume.pdf"
            download
            className="px-6 py-3 bg-syracuse-blue text-white font-medium rounded-md hover:bg-blue-800 transition-colors duration-200"
          >
            Download PDF
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Open in New Tab
          </a>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <PDFViewer fileUrl="/resume.pdf" />
        </div>
      </div>
    </section>
  );
}