'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

// Configure PDF.js worker via bundler-resolved URL to avoid CDN fallback.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

interface PDFViewerProps {
  fileUrl: string
}

export function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
    setError(false)
  }

  function onDocumentLoadError() {
    setLoading(false)
    setError(true)
  }

  function goToPreviousPage() {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1))
  }

  function goToNextPage() {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages))
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-700 mb-4">Unable to load PDF. Please try downloading it instead.</p>
        <a
          href={fileUrl}
          download
          className="px-6 py-3 bg-syracuse-blue text-white font-medium rounded-md hover:bg-blue-800 transition-colors duration-200 inline-block"
        >
          Download PDF
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {loading && (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-syracuse-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      )}

      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        className="max-w-full"
      >
        <Page
          pageNumber={pageNumber}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          className="max-w-full"
          width={Math.min(800, typeof window !== 'undefined' ? window.innerWidth - 40 : 800)}
        />
      </Document>

      {!loading && numPages > 0 && (
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          <p className="text-gray-700">
            Page {pageNumber} of {numPages}
          </p>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
