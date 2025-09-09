import { z } from 'zod'

// Project schemas
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  repoUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  impactMetric: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  technologies: z.array(z.object({
    tech: z.object({
      id: z.string(),
      name: z.string(),
    })
  })).optional(),
})

export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  technologies: true,
}).extend({
  techNames: z.array(z.string()).optional(),
})

// API Response schemas
export const ApiProjectSchema = ProjectSchema.extend({
  technologies: z.array(z.string()).optional(), // Just tech names for API
})

export const ProjectsApiResponseSchema = z.object({
  projects: z.array(ApiProjectSchema),
  total: z.number(),
})

// Tech Tag schemas
export const TechTagSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  createdAt: z.date(),
})

// Metric schemas  
export const MetricSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
})

// API Query params
export const ProjectQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().optional(),
  tech: z.string().optional(),
})

// Contact form (for the AI suggester)
export const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email format"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
})

// Environment validation
export const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  SENTRY_DSN: z.string().url().optional(),
})

// Type exports
export type Project = z.infer<typeof ProjectSchema>
export type CreateProject = z.infer<typeof CreateProjectSchema>
export type ApiProject = z.infer<typeof ApiProjectSchema>
export type ProjectsApiResponse = z.infer<typeof ProjectsApiResponseSchema>
export type TechTag = z.infer<typeof TechTagSchema>
export type Metric = z.infer<typeof MetricSchema>
export type ProjectQuery = z.infer<typeof ProjectQuerySchema>
export type ContactForm = z.infer<typeof ContactFormSchema>