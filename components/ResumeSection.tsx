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
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe
            src="/resume.pdf#toolbar=0"
            className="w-full h-[720px] border-0"
            title="Resume PDF"
          >
            <p className="p-4 text-center">
              Your browser does not support PDF viewing.
              <a href="/resume.pdf" className="text-syracuse-orange underline ml-1">
                Download the PDF
              </a> instead.
            </p>
          </iframe>
        </div>
      </div>
    </section>
  );
}