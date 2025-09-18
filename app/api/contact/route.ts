import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { z } from 'zod'

// Email service configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000)
})

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
    const body = await request.json()
    console.log('Contact form submission:', { name: body.name, email: body.email, messageLength: body.message?.length })

    // Validate input
    const validatedData = contactSchema.parse(body)
    const { name, email, message } = validatedData

    // 1. Save to Supabase database
    console.log('Attempting to save to database...')
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject: null, // Explicitly set optional field
        message,
        replied: false
      }
    })
    console.log('Contact saved successfully:', contact.id)

    // 2. Generate AI response
    const aiResponse = await generateAIResponse(name, email, message)

    // 3. Send email notification to Trevor
    if (RESEND_API_KEY && RESEND_API_KEY !== 'your_resend_api_key_here') {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Portfolio Contact <noreply@your-domain.com>', // Replace with your verified domain
            to: ['tmille12@syr.edu'],
            subject: `New Portfolio Contact: ${name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #051C3D;">New Contact Form Submission</h2>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>Contact Details:</h3>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                </div>

                <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
                  <h3>Message:</h3>
                  <p style="white-space: pre-wrap;">${message}</p>
                </div>

                <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>📤 Suggested AI Response:</h3>
                  <div style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 14px;">
${aiResponse}
                  </div>
                  <p style="margin-top: 15px; font-size: 12px; color: #666;">
                    💡 You can copy this response and personalize it as needed, or write your own reply.
                  </p>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                  <p style="color: #666; font-size: 12px;">
                    This message was submitted through your portfolio website contact form.
                  </p>
                </div>
              </div>
            `
          })
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Continue execution even if email fails
      }
    }

    // 4. Send confirmation email to submitter
    if (RESEND_API_KEY && RESEND_API_KEY !== 'your_resend_api_key_here') {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Trevor Miller <noreply@your-domain.com>', // Replace with your verified domain
            to: [email],
            subject: 'Thanks for reaching out!',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #051C3D;">Thanks for contacting me!</h2>

                <p>Hi ${name},</p>

                <p>Thank you for reaching out through my portfolio website. I've received your message and will get back to you soon!</p>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>Your message:</h3>
                  <p style="white-space: pre-wrap; font-style: italic;">"${message}"</p>
                </div>

                <p>In the meantime, feel free to:</p>
                <ul>
                  <li>Check out my projects on <a href="https://github.com/TrevorMiller04" style="color: #051C3D;">GitHub</a></li>
                  <li>Connect with me on <a href="https://linkedin.com/in/trevor-miller04" style="color: #051C3D;">LinkedIn</a></li>
                  <li>Download my <a href="https://your-domain.com/resume.pdf" style="color: #051C3D;">resume</a></li>
                </ul>

                <p>Best regards,<br>
                <strong>Trevor Miller</strong><br>
                Computer Science Major<br>
                Syracuse University</p>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                  <p style="color: #666; font-size: 12px;">
                    This is an automated confirmation. Please don't reply to this email.
                  </p>
                </div>
              </div>
            `
          })
        })
      } catch (confirmationError) {
        console.error('Confirmation email failed:', confirmationError)
        // Continue execution even if confirmation email fails
      }
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

    if (error instanceof z.ZodError) {
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