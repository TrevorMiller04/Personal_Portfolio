import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { ContactFormSchema } from '../../../lib/validation'
import { checkRateLimit, getClientIP } from '../../../lib/rate-limit'
import { Resend } from 'resend'

// Email service configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'trevormiller68@icloud.com'
const resend = RESEND_API_KEY && RESEND_API_KEY !== 'your_resend_api_key_here'
  ? new Resend(RESEND_API_KEY)
  : null


// AI Response Generator using OpenAI API or Anthropic (mock for now)
async function generateAIResponse(name: string, email: string, message: string): Promise<string> {
  // This would integrate with OpenAI or Anthropic API
  // For now, returning a contextual template response

  const messageType = detectMessageType(message.toLowerCase())

  const responses = {
    job_inquiry: `Hi ${name},

Thank you for reaching out about potential opportunities! I appreciate your interest.

I'm currently seeking summer 2025 internships and full-time positions starting after my December 2026 graduation from Syracuse University. My focus areas include:

• Data Science & AI/ML Engineering
• Software Engineering
• Product Management

Based on your message, it sounds like this could be a great fit. I'd love to learn more about the role and discuss how my background in computer science, statistics, and seven years of professional experience could contribute to your team.

I'm available for a call or video chat at your convenience. Please let me know what next steps work best for you.

Best regards,
Trevor Miller
Syracuse University - CS Major
LinkedIn: https://linkedin.com/in/trevor-miller04
GitHub: https://github.com/TrevorMiller04`,

    collaboration: `Hi ${name},

Thanks for reaching out about a potential collaboration! I'm always interested in working on innovative projects.

Given my background in computer science with focuses in AI/ML and data analytics, I'd be excited to explore how we might work together. My experience includes:

• Programming in Python, JavaScript, Java
• Data analysis and visualization
• AI/ML engineering concepts
• Full-stack web development

I'd love to hear more details about what you have in mind. Feel free to share more about the project scope, timeline, and how you envision our collaboration.

Looking forward to discussing this further!

Best,
Trevor Miller`,

    general: `Hi ${name},

Thank you for your message! I appreciate you taking the time to reach out.

I'll review your message carefully and get back to you soon. In the meantime, feel free to check out my projects on GitHub (https://github.com/TrevorMiller04) or connect with me on LinkedIn (https://linkedin.com/in/trevor-miller04).

If this is regarding internship opportunities, please note that I'm actively seeking summer 2025 positions and full-time roles after my December 2026 graduation.

Best regards,
Trevor Miller
Computer Science Major
Syracuse University`
  }

  return responses[messageType] || responses.general
}

function detectMessageType(message: string): 'job_inquiry' | 'collaboration' | 'general' {
  const jobKeywords = ['job', 'position', 'internship', 'hire', 'opportunity', 'role', 'career', 'interview', 'application']
  const collabKeywords = ['collaboration', 'project', 'partner', 'work together', 'team up', 'collaborate']

  if (jobKeywords.some(keyword => message.includes(keyword))) {
    return 'job_inquiry'
  }

  if (collabKeywords.some(keyword => message.includes(keyword))) {
    return 'collaboration'
  }

  return 'general'
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 5 requests per hour per IP
    const clientIP = getClientIP(request)
    const rateLimitResult = checkRateLimit(clientIP, 5)

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset)
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': resetDate.toISOString()
          }
        }
      )
    }

    console.log('Rate limit check passed:', {
      ip: clientIP,
      remaining: rateLimitResult.remaining
    })

    const body = await request.json()
    console.log('Contact form submission:', { name: body.name, email: body.email, messageLength: body.message?.length })

    // Validate input
    const validatedData = ContactFormSchema.parse(body)
    const { name, email, subject, message } = validatedData

    // 1. Save to Supabase database
    console.log('Attempting to save to database...')
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
        replied: false
      }
    })
    console.log('Contact saved successfully:', contact.id)

    // 2. Generate AI response
    const aiResponse = await generateAIResponse(name, email, message)

    // 3. Send emails
    if (resend) {
      try {
        // Send notification to Trevor (using Resend account email for test domain)
        await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>', // TODO: Replace with verified domain
          to: NOTIFICATION_EMAIL,
          subject: `New Contact Form Message from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <h3>Suggested AI Response:</h3>
            <pre style="white-space: pre-wrap; font-family: sans-serif;">${aiResponse}</pre>
            <hr>
            <p><small>View in database: Contact ID ${contact.id}</small></p>
          `
        })
        console.log('Notification email sent to Trevor')

      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Don't fail the entire request if email fails
        // Contact is already saved to database
      }
    } else {
      console.warn('Email sending skipped: RESEND_API_KEY not configured')
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      contactId: contact.id
    })

  } catch (error) {
    console.error('Contact form error:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })

    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('Validation errors:', error.errors)
      return NextResponse.json(
        { success: false, message: 'Invalid form data', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send message. Please try again.',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}