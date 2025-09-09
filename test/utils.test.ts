import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-2 py-1', 'bg-red-500', 'text-white')
      expect(result).toBe('px-2 py-1 bg-red-500 text-white')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class', 'another-class')
      expect(result).toBe('base-class active-class another-class')
    })

    it('should handle falsy values', () => {
      const result = cn('base-class', false, null, undefined, 'valid-class')
      expect(result).toBe('base-class valid-class')
    })

    it('should override conflicting Tailwind classes', () => {
      const result = cn('p-4', 'p-2') // p-2 should override p-4
      expect(result).toBe('p-2')
    })

    it('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })
})