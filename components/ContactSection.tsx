'use client'

import { useState } from 'react'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simple form submission - in production, integrate with email service
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      console.log('Form submitted:', formData)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section">
      <h2>Contact</h2>
      <div className="contact-info">
        <p>Get in touch to discuss opportunities or collaborations!</p>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleInputChange}
            required 
          />
          
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleInputChange}
            required 
          />
          
          <label htmlFor="message">Message</label>
          <textarea 
            id="message" 
            name="message" 
            rows={5} 
            value={formData.message}
            onChange={handleInputChange}
            required
          />

          <button 
            type="submit" 
            className="btn primary"
            disabled={isSubmitting}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {submitStatus === 'success' && (
          <div style={{ 
            background: '#d4edda', 
            color: '#155724', 
            padding: '1rem', 
            borderRadius: 'var(--radius)',
            border: '1px solid #c3e6cb',
            marginTop: '1rem'
          }}>
            Thank you! Your message has been sent successfully.
          </div>
        )}

        {submitStatus === 'error' && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '1rem', 
            borderRadius: 'var(--radius)',
            border: '1px solid #f5c6cb',
            marginTop: '1rem'
          }}>
            Sorry, there was an error sending your message. Please try again.
          </div>
        )}

        <div className="contact-links">
          <a href="mailto:trmille3@syr.edu" className="btn">Email Direct</a>
          <a href="https://linkedin.com/in/trevor-miller04" target="_blank" rel="noopener noreferrer" className="btn">LinkedIn</a>
          <a href="https://github.com/TrevorMiller04" target="_blank" rel="noopener noreferrer" className="btn">GitHub</a>
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--brand2)' }}>
          <p><strong>Currently seeking:</strong> Summer 2025 internships and full-time opportunities after December 2026 graduation</p>
          <p><strong>Location:</strong> Open to remote, hybrid, or on-site positions</p>
          <p><strong>Interests:</strong> Data Science, AI/ML Engineering, Software Engineering, Product Management</p>
        </div>
      </div>
    </section>
  )
}