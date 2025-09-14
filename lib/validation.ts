import { z } from 'zod'

// Project validation schema aligned with Prisma model
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  role: z.string().min(1),
  date: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().optional().nullable(),
  techStack: z.array(z.string()).min(1),
  repoUrl: z.string().url().optional().nullable(),
  liveUrl: z.string().url().optional().nullable(),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string(),
    caption: z.string()
  })).optional().nullable(),
  featured: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  role: z.string().min(1, 'Role is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().optional(),
  techStack: z.array(z.string()).min(1, 'At least one technology is required'),
  repoUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string(),
    caption: z.string()
  })).optional(),
  featured: z.boolean().default(false)
})

// Contact form validation schema
export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address is required'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

// Skill validation schema
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: z.enum(['Languages', 'Frameworks', 'Tools/Cloud', 'Coursework']),
  experience: z.array(z.string()).min(1),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.enum(['Languages', 'Frameworks', 'Tools/Cloud', 'Coursework']),
  experience: z.array(z.string()).min(1, 'At least one experience bullet is required'),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional()
})

// Type exports
export type Project = z.infer<typeof ProjectSchema>
export type CreateProject = z.infer<typeof CreateProjectSchema>
export type ContactForm = z.infer<typeof ContactFormSchema>
export type Skill = z.infer<typeof SkillSchema>
export type CreateSkill = z.infer<typeof CreateSkillSchema>