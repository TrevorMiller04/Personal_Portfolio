'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactFormSchema } from '@/lib/validation'
import { Loader2, Copy, Sparkles, Send, CheckCircle } from 'lucide-react'
import { z } from 'zod'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const generateSuggestion = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Validate form data
      ContactFormSchema.parse(formData)

      const response = await fetch('/api/ai/suggest-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate suggestion')
      }

      const data = await response.json()
      setSuggestion(data.suggestion)
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError('Please fill out all fields correctly')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate suggestion')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!suggestion) return

    try {
      await navigator.clipboard.writeText(suggestion)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.message.trim().length >= 10

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">
            Interested in collaborating? Send me a message and I'll get back to you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Fill out the form to see the AI-powered reply suggester in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell me about your project or opportunity..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 10 characters
                </p>
              </div>

              <Button
                onClick={generateSuggestion}
                disabled={!isFormValid || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating AI Reply...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Reply Suggestion
                  </>
                )}
              </Button>

              {error && (
                <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Suggestion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Reply Suggestion
              </CardTitle>
              <CardDescription>
                Powered by Claude AI with custom prompts and rate limiting
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!suggestion && (
                <div className="text-center py-12 text-muted-foreground">
                  <Send className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Fill out the contact form and click "Generate AI Reply Suggestion" to see the AI-powered response.</p>
                </div>
              )}

              {suggestion && (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg relative">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {suggestion}
                    </pre>
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>✨ Generated by Claude AI (Haiku model)</p>
                    <p>🔒 Rate limited: 10 requests per hour per IP</p>
                    <p>📝 Prompt version: v1.0</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>How This Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🤖 AI Integration</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Anthropic Claude API</li>
                  <li>• Server-only processing</li>
                  <li>• Zod input validation</li>
                  <li>• Custom prompt engineering</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔒 Security & Privacy</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Rate limiting (10/hour)</li>
                  <li>• No data storage</li>
                  <li>• Server-side validation</li>
                  <li>• Error handling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⚡ Performance</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Fast Haiku model</li>
                  <li>• Optimized prompts</li>
                  <li>• Client-side caching</li>
                  <li>• Progressive enhancement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}