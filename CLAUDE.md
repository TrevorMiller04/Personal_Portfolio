# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Trevor Miller's academic portfolio website showcasing authentic work and technical skills. Built with modern Next.js 14 and TypeScript while preserving the original Syracuse University branding and professional academic presentation.

## Design Philosophy

**Authenticity First**: Only showcase real projects, actual skills, and genuine academic achievements. No fictional work or exaggerated capabilities.

**Syracuse Branding**: Preserve the orange/blue color scheme (#C13F03/#051C3D) and campus background that represents Syracuse University identity.

**Academic Focus**: Maintain the professional tone suitable for recruiters, emphasizing coursework, real experience, and specific technical competencies.

## Architecture

- **Framework**: Next.js 14 (App Router) with TypeScript strict mode
- **UI**: Custom CSS (converted from original) + selective modern components
- **Database**: Supabase (Postgres) with Prisma ORM for project management
- **Data Fetching**: TanStack Query with Zod validation
- **Styling**: Preserved original design system with CSS-in-JS or CSS modules
- **Performance**: Optimized build system with <150KB app shell
- **CI/QA**: ESLint, Prettier, Playwright e2e testing
- **Hosting**: Vercel with GitHub deployment

## Tech Stack Requirements

- Next.js 14 (App Router) with **TypeScript strict**
- Preserve original Syracuse color scheme and typography
- Supabase (Postgres) + Prisma ORM (for real projects only)
- Zod validation + TanStack Query
- ESLint/Prettier, Playwright e2e testing
- Performance budget (<150KB app shell)
- Maintain original campus background and layout

## Project Structure

```
/
├─ app/
│   ├─ api/
│   │   └─ projects/route.ts   # Projects API with Zod validation
│   ├─ globals.css             # Original design system converted to CSS
│   ├─ layout.tsx              # Root layout with Syracuse branding
│   └─ page.tsx                # Single-page portfolio (original structure)
├─ components/
│   ├─ ProjectCard.tsx         # Real project display component
│   ├─ SkillsSection.tsx       # Detailed skills with experience bullets
│   └─ ContactForm.tsx         # Simple contact form
├─ lib/
│   ├─ db.ts                   # Prisma client
│   ├─ validation.ts           # Zod schemas
│   └─ utils.ts                # Utility functions
├─ prisma/
│   ├─ schema.prisma           # Database schema (real projects)
│   └─ seed.ts                 # Seed with actual project data
├─ public/
│   ├─ campus.png              # Syracuse campus background (original)
│   ├─ headshot2.png           # Professional headshot (original)
│   └─ resume.pdf              # Current resume
├─ data/                       # Original data files (for reference)
│   ├─ projects.json           # Real projects from main branch
│   └─ skills.json             # Detailed skills from main branch
└─ .github/workflows/ci.yml    # Basic CI/QA pipeline
```

## Key Features

1. **Authentic Projects**: Real portfolio project with detailed technical descriptions
2. **Academic Focus**: Coursework, GPA, leadership roles, genuine experience
3. **Syracuse Branding**: Orange/blue colors, campus background, university identity
4. **Professional Skills**: Detailed experience bullets for each technology
5. **Modern Foundation**: TypeScript, Next.js performance, proper SEO
6. **Recruiter-Ready**: Academic presentation suitable for internship/job applications

## Database Schema (Prisma)

- **Project**: id, title, role, date, description, longDescription, techStack[], repoUrl, images[]
- **Contact**: id, name, email, message, createdAt (simple contact form submissions)

## Development Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npm run db:migrate             # Run Prisma migrations
npm run db:seed                # Seed database with real project data
npm run db:generate            # Generate Prisma client

# Quality Assurance
npm run lint                   # ESLint check
npm run lint:fix               # Fix ESLint issues
npm run typecheck              # TypeScript check
npm run e2e                    # Run Playwright e2e tests
```

## Environment Variables

**Required for production:**
- `DATABASE_URL` - Supabase Postgres connection string
- `SUPABASE_URL` - Supabase project URL  
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for server operations

**Optional:**
- `RESEND_API_KEY` - For contact form email notifications

## Performance Budget

- **App shell JS**: <150KB (Next.js bundle)
- **LCP (Largest Contentful Paint)**: <2.5s
- **Mobile Lighthouse score**: ≥90

## Content Guidelines

**Always Authentic**: 
- Only real projects with actual technical details
- Genuine coursework and academic achievements
- True leadership roles and work experience
- Specific skills with real experience examples

**Syracuse Identity**:
- Maintain orange (#C13F03) and blue (#051C3D) color scheme
- Keep campus background for Syracuse University representation
- Professional academic tone suitable for recruiters

## Implementation Approach

- **Preserve Original Design**: Convert existing CSS to modern CSS-in-JS/modules
- **Real Content First**: Import actual projects and skills data
- **Modern Foundation**: Next.js performance with authentic presentation
- **Recruiter-Focused**: Academic portfolio suitable for internships and entry-level positions