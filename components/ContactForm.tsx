'use client'

import { useState } from 'react'
import { ContactFormSchema } from '../lib/validation'

export function ContactForm() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'trevormiller68@icloud.com'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({}) // Clear previous errors
    setIsSubmitting(true)

    // Client-side validation
    const validation = ContactFormSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setErrors({})
      } else {
        console.error('Form submission failed:', result)
        // Parse validation errors if available
        if (result.errors && Array.isArray(result.errors)) {
          const fieldErrors: Record<string, string> = {}
          result.errors.forEach((err: any) => {
            if (err.path && err.path[0]) {
              fieldErrors[err.path[0]] = err.message
            }
          })
          setErrors(fieldErrors)
        }
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async (text: string, button: HTMLElement) => {
    try {
      await navigator.clipboard.writeText(text)
      const originalText = button.textContent
      button.textContent = 'Copied!'
      setTimeout(() => {
        button.textContent = originalText
      }, 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <section id="contact" className="mb-20">
      <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact</h3>
      <div className="max-w-2xl mx-auto">
        <p className="text-lg text-gray-700 mb-8 text-center">
          Get in touch to discuss opportunities or collaborations!
        </p>

        <form className="space-y-6 mb-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-syracuse-blue focus:border-syracuse-blue"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-syracuse-blue focus:border-syracuse-blue"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject (Optional)
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-syracuse-blue focus:border-syracuse-blue"
            />
            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-syracuse-blue focus:border-syracuse-blue"
            />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-syracuse-blue text-white font-medium rounded-md hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6">
            Thank you! Your message has been sent successfully.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
            Sorry, there was an error sending your message. Please try again.
          </div>
        )}

        <div className="space-y-4 mb-8">
          <button
            onClick={(e) => copyToClipboard(contactEmail, e.currentTarget)}
            className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <strong>Email:</strong> {contactEmail}
          </button>
          <button
            onClick={(e) => copyToClipboard('978-646-7116', e.currentTarget)}
            className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <strong>Phone:</strong> 978-646-7116
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <a
            href="https://www.linkedin.com/in/trevor-miller04/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-syracuse-blue text-white font-medium rounded-md hover:bg-blue-800 transition-colors duration-200"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/TrevorMiller04"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            GitHub
          </a>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Currently seeking:</strong> Summer 2025 internships and full-time opportunities after December 2026 graduation</p>
          <p><strong>Location:</strong> Open to remote, hybrid, or on-site positions</p>
          <p><strong>Interests:</strong> Data Science, AI/ML Engineering, Software Engineering, Product Management</p>
        </div>
      </div>
    </section>
  )
}