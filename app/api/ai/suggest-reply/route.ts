import { NextRequest, NextResponse } from 'next/server'
import { ContactFormSchema } from '@/lib/validation'
import { z } from 'zod'

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 10

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [])
  }

  const requests = rateLimitMap.get(ip)!
  // Remove old requests outside the window
  const recentRequests = requests.filter(time => now - time < windowMs)
  
  if (recentRequests.length >= maxRequests) {
    return true
  }

  // Add current request
  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)
  
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown'
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const { name, email, message } = ContactFormSchema.parse(body)

    // Check if we have Anthropic API key
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicApiKey) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      )
    }

    // Import Anthropic SDK dynamically to avoid bundling issues
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    
    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    })

    // Generate reply using Claude
    const prompt = `You are Trevor Miller's professional email assistant. Generate a direct, actionable email reply for this contact form submission.

**Guidelines:**
- Tone: warm, concise, helpful
- Include one concrete next step or question
- If spam-like, start with "[Potential spam — review before sending]"
- Never invent facts or commit to specific dates/times
- No signature block needed

**Contact Details:**
- Name: ${name}
- Email: ${email}
- Message: ${message}

Write the complete email reply (not just suggestions):`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      temperature: 0.7,
      system: "You are Trevor Miller's professional email assistant. Generate direct, actionable email replies for portfolio inquiries.",
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const suggestion = response.content[0]?.type === 'text' ? response.content[0].text : 'Unable to generate suggestion'

    return NextResponse.json({
      success: true,
      suggestion,
      metadata: {
        model: 'claude-3-haiku-20240307',
        prompt_version: 'v1.0',
        generated_at: new Date().toISOString(),
      },
    })

  } catch (error) {
    console.error('AI suggest-reply error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // Handle specific API errors
      if (error.message.includes('rate_limit')) {
        return NextResponse.json(
          { error: 'AI service rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }

      if (error.message.includes('authentication')) {
        return NextResponse.json(
          { error: 'AI service authentication error' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate reply suggestion' },
      { status: 500 }
    )
  }
}