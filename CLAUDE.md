# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Trevor Miller's modern portfolio website built with Next.js 14 (App Router) and TypeScript. It showcases full-stack development capabilities with data analytics, AI integration, and modern DevOps practices to impress recruiters.

## Architecture

- **Framework**: Next.js 14 (App Router) with TypeScript strict mode
- **UI**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (Postgres) with Prisma ORM
- **Data Fetching**: TanStack Query with Zod validation
- **Analytics**: DuckDB-WASM for in-browser data processing + Plotly charts
- **dbt**: Local dbt project with staging/marts models and tests
- **AI**: Server-only contact-reply suggester with rate limiting
- **Observability**: Sentry (client + server)
- **CI/QA**: ESLint, Prettier, Vitest, Playwright, GitHub Actions
- **Hosting**: Vercel with GitHub deployment

## Tech Stack Requirements

- Next.js 14 (App Router) with **TypeScript strict**
- Tailwind CSS + shadcn/ui
- Supabase (Postgres) + Prisma ORM
- Zod validation + TanStack Query
- ESLint/Prettier, Vitest unit tests, Playwright e2e
- GitHub Actions CI/QA pipeline with status badge
- Sentry observability + performance budget (<150KB app shell)
- Data Stories page with DuckDB-WASM + 2 Plotly charts
- dbt mini-project (1 staging + 1 marts model + 1 test)
- AI contact-reply suggester (server-only, rate-limited)

## Project Structure

```
/
├─ app/
│   ├─ (site)/
│   │   └─ layout.tsx          # Site layout with nav/footer
│   ├─ api/
│   │   ├─ projects/route.ts   # Projects API with Zod validation
│   │   └─ ai/suggest-reply/route.ts  # AI contact suggester
│   ├─ data-stories/page.tsx   # DuckDB-WASM + Plotly analytics
│   ├─ projects/page.tsx       # Projects showcase with TanStack Query
│   ├─ contact/page.tsx        # Contact form with AI suggestions
│   ├─ globals.css             # Tailwind + custom styles
│   ├─ layout.tsx              # Root layout
│   └─ page.tsx                # Homepage with JSON-LD
├─ components/
│   ├─ ui/                     # shadcn/ui components
│   └─ ProjectCard.tsx         # Project display component
├─ lib/
│   ├─ db.ts                   # Prisma client
│   ├─ validation.ts           # Zod schemas
│   └─ utils.ts                # Utility functions
├─ prisma/
│   ├─ schema.prisma           # Database schema
│   └─ seed.ts                 # Database seed data
├─ analytics/dbt/              # dbt mini-project
│   ├─ models/staging/stg_orders.sql
│   ├─ models/marts/fct_sales_by_month.sql
│   └─ target/                 # Generated docs
├─ prompts/
│   └─ contact_suggester_v1.md # AI prompt versions
├─ public/
│   └─ data/sample_orders.csv  # Sample data for analytics
├─ .github/workflows/ci.yml    # CI/QA pipeline
├─ sentry.client.config.ts     # Sentry client config
└─ sentry.server.config.ts     # Sentry server config
```

## Key Features

1. **Projects Showcase**: Database-backed project cards with tech stack chips, fetched via TanStack Query
2. **Data Stories**: Interactive analytics page with DuckDB-WASM running SQL in browser + 2 Plotly charts
3. **dbt Integration**: Mini data modeling project with staging/marts models and tests
4. **AI Contact Suggester**: Server-only LLM integration with rate limiting and Zod validation
5. **Modern Dev Experience**: TypeScript strict, ESLint/Prettier, comprehensive testing
6. **Performance Monitoring**: Sentry observability + bundle size budget (<150KB)
7. **CI/QA Pipeline**: Automated testing and deployment with GitHub Actions

## Database Schema (Prisma)

- **Project**: id, title, summary, repoUrl, demoUrl, impactMetric
- **TechTag**: id, name
- **ProjectTech**: projectId, techId (many-to-many)
- **Metric**: name, value (for analytics)

## Development Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npm run db:migrate             # Run Prisma migrations
npm run db:seed                # Seed database with sample data
npm run db:generate            # Generate Prisma client

# Quality Assurance
npm run lint                   # ESLint check
npm run lint:fix               # Fix ESLint issues
npm run prettier               # Prettier check
npm run prettier:fix           # Fix Prettier issues
npm run typecheck              # TypeScript check
npm run test                   # Run Vitest unit tests
npm run test:ui                # Vitest UI
npm run e2e                    # Run Playwright e2e tests

# dbt Analytics
cd analytics/dbt && dbt run     # Run dbt models
cd analytics/dbt && dbt test    # Run dbt tests
cd analytics/dbt && dbt docs generate  # Generate docs
```

## Environment Variables

**Required for production:**
- `DATABASE_URL` - Supabase Postgres connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for server operations
- `SENTRY_DSN` - Sentry project DSN for error tracking
- `ANTHROPIC_API_KEY` - Claude API key for AI features (or OpenAI)

**Optional:**
- `SENTRY_AUTH_TOKEN` - For Sentry release management
- `RESEND_API_KEY` - If using Resend for email notifications

## Performance Budget

- **App shell JS**: <150KB (Next.js bundle)
- **LCP (Largest Contentful Paint)**: <2.5s
- **Mobile Lighthouse score**: ≥95

## CI/QA Pipeline

GitHub Actions workflow runs on push/PR:
1. Install dependencies
2. ESLint + Prettier checks
3. TypeScript type checking
4. Vitest unit tests
5. Playwright e2e tests
6. Build verification

Badge: ![CI](https://github.com/TrevorMiller04/Personal_Portfolio/workflows/CI/badge.svg)

## Data Analytics Features

- **DuckDB-WASM**: In-browser SQL processing of CSV data
- **Plotly Charts**: Interactive bar chart (sales by category) + line chart (monthly trends)  
- **dbt Models**: Staging layer (`stg_orders`) + marts layer (`fct_sales_by_month`)
- **dbt Tests**: Data quality assertions and documentation

## AI Integration

- **Server-only processing**: No API keys exposed to client
- **Rate limiting**: 10 requests per hour per IP address
- **Zod validation**: Type-safe input validation
- **Prompt versioning**: Tracked in `prompts/` directory with version numbers
- **PII protection**: No sensitive data logging

## Deployment Setup

1. **GitHub**: Push to repository triggers CI/QA pipeline
2. **Vercel**: Connected for automatic deployments from main branch
3. **Supabase**: Database setup with connection pooling
4. **Environment Variables**: Configure in Vercel dashboard
5. **Sentry**: Project setup for error tracking
6. **Domain**: Custom domain configuration (trevormiller.xyz)

## Implementation Approach

- **Minimal Viable Increments**: Each feature works end-to-end before moving to next
- **Atomic Commits**: Clear commit messages following `feat(area): description` format
- **Local Testing**: Verify each step locally before committing
- **Documentation**: README updates with "What, Why, How to run, Evidence" for each feature