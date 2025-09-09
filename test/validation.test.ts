import { describe, it, expect } from 'vitest'
import { ProjectSchema, ProjectQuerySchema, ContactFormSchema } from '@/lib/validation'

describe('Zod Validation Schemas', () => {
  describe('ProjectSchema', () => {
    it('should validate a valid project', () => {
      const validProject = {
        id: 'test-id',
        title: 'Test Project',
        summary: 'A test project summary',
        repoUrl: 'https://github.com/user/repo',
        demoUrl: 'https://demo.example.com',
        impactMetric: '99% performance improvement',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = ProjectSchema.safeParse(validProject)
      expect(result.success).toBe(true)
    })

    it('should reject project with empty title', () => {
      const invalidProject = {
        id: 'test-id',
        title: '',
        summary: 'A test project summary',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = ProjectSchema.safeParse(invalidProject)
      expect(result.success).toBe(false)
    })

    it('should accept project with optional fields missing', () => {
      const minimalProject = {
        id: 'test-id',
        title: 'Test Project',
        summary: 'A test project summary',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = ProjectSchema.safeParse(minimalProject)
      expect(result.success).toBe(true)
    })
  })

  describe('ProjectQuerySchema', () => {
    it('should apply default values for missing params', () => {
      const result = ProjectQuerySchema.parse({})
      
      expect(result.limit).toBe(10)
      expect(result.offset).toBe(0)
      expect(result.search).toBeUndefined()
      expect(result.tech).toBeUndefined()
    })

    it('should coerce string numbers to numbers', () => {
      const result = ProjectQuerySchema.parse({
        limit: '25',
        offset: '50',
      })
      
      expect(result.limit).toBe(25)
      expect(result.offset).toBe(50)
    })

    it('should enforce limits', () => {
      const result = ProjectQuerySchema.safeParse({
        limit: 150, // Over max of 100
      })
      
      expect(result.success).toBe(false)
    })
  })

  describe('ContactFormSchema', () => {
    it('should validate a proper contact form', () => {
      const validForm = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message with enough characters',
      }

      const result = ContactFormSchema.safeParse(validForm)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidForm = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'This is a test message with enough characters',
      }

      const result = ContactFormSchema.safeParse(invalidForm)
      expect(result.success).toBe(false)
    })

    it('should reject message too short', () => {
      const invalidForm = {
        name: 'John Doe', 
        email: 'john@example.com',
        message: 'Too short',
      }

      const result = ContactFormSchema.safeParse(invalidForm)
      expect(result.success).toBe(false)
    })
  })
})