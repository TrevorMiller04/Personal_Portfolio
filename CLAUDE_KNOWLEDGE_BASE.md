# CLAUDE Knowledge Base

## Overview
This file tracks recurring mistakes, solutions, and best practices discovered during development. Reference this before making changes to avoid repeating past errors.

## Common Mistakes & Solutions

### React/Next.js Patterns

#### ✅ Fixed: Hardcoding content in components
**Location**: `app/page.tsx:106-109`
**Issue**: Projects were hardcoded instead of using data files
**Solution**: Implemented proper data fetching with async function and ProjectCard components
**Context7 Reference**: Next.js data fetching patterns and Server Components
**Fixed**: 2025-01-14

#### ✅ Fixed: Missing TypeScript strict mode
**Issue**: Was using `.js` files instead of `.tsx` with proper typing
**Solution**: Converted to TypeScript with proper interfaces, added tsconfig.json with strict mode
**Context7 Reference**: TypeScript best practices for React
**Fixed**: 2025-01-14

#### ✅ Fixed: Not following Syracuse branding
**Issue**: Was using generic colors instead of Syracuse orange (#C13F03) and blue (#051C3D)
**Solution**: Updated Tailwind config with Syracuse colors and applied throughout UI components
**CLAUDE.md Reference**: Design Philosophy section
**Fixed**: 2025-01-14

### Performance Issues

#### ❌ Mistake: Large bundle sizes
**Issue**: Including unnecessary dependencies or large components
**Solution**: Code splitting, dynamic imports, tree shaking
**Context7 Reference**: Next.js performance optimization
**Target**: <150KB app shell per CLAUDE.md

### Database/API Patterns

#### ❌ Mistake: Missing input validation
**Issue**: API endpoints without proper validation
**Solution**: Implement Zod schemas for all inputs
**Context7 Reference**: Zod validation patterns
**Required**: Per CLAUDE.md architecture

## Framework-Specific Notes

### Next.js 15 App Router
- Always use App Router patterns, not Pages Router
- Prefer server components over client components when possible
- Use proper TypeScript with strict mode

### Tailwind CSS
- Follow Syracuse color scheme: orange-600 (#C13F03), blue-900 (#051C3D)
- Maintain responsive design patterns
- Avoid hardcoded colors

### Database (Supabase + Prisma)
- All models need proper TypeScript types
- Use Zod validation for API routes
- Follow schema defined in CLAUDE.md

## Validation Checkpoints

### Before Component Changes
- [ ] Check this knowledge base for similar past mistakes
- [ ] Validate against Context7 best practices for the framework
- [ ] Ensure Syracuse branding compliance

### Before API Implementation
- [ ] Verify Zod validation schema exists
- [ ] Check Context7 for security best practices
- [ ] Confirm database schema alignment

### Pre-Commit Checks
- [ ] TypeScript strict mode passes
- [ ] ESLint/Prettier formatting
- [ ] Performance budget maintained (<150KB)
- [ ] Syracuse branding preserved

## Context7 Validation Points

### High-Priority Validations
1. **React Component Patterns**: Query Context7 before creating new components
2. **Next.js Performance**: Validate bundle size and loading patterns
3. **TypeScript Strict Mode**: Ensure proper typing throughout
4. **Security Practices**: Validate API routes and data handling

### Quick Reference Commands
- Validate React patterns: Context7 query for "react component best practices"
- Check Next.js performance: Context7 query for "nextjs performance optimization"
- TypeScript validation: Context7 query for "typescript strict mode patterns"

## Learning Log

### Recent Fixes
**2025-01-14**:
- ✅ Converted hardcoded content to use data files with proper async data fetching
- ✅ Implemented TypeScript with strict mode and proper interfaces
- ✅ Applied Syracuse University branding throughout the application
- ✅ Created component-based architecture with ProjectCard component
- ✅ Added Prisma database integration with proper schema and validation

### Pattern Improvements
**Context7 Validated Patterns**:
- Server Components for data fetching (Next.js 15 App Router)
- Proper TypeScript interfaces for props validation
- Component composition with proper separation of concerns
- Syracuse branding applied consistently using Tailwind custom colors

---

**Last Updated**: 2025-01-14
**Next Review**: After major component changes or API implementations