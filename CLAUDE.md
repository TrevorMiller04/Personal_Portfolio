# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Trevor Miller's personal portfolio website - a single-page site built with vanilla HTML/CSS/JS and a Flask backend. It features a clean, professional design with contact form integration via Resend email and Supabase storage.

## Architecture

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Python Flask (serverless functions)
- **Hosting**: Vercel with GitHub deployment
- **Email**: Resend service integration
- **Database**: Supabase (contact form submissions)
- **Domain**: trevormiller.xyz (to be configured later)

## Project Structure

```
/
├─ index.html              # Main HTML file
├─ styles.css             # All styling with CSS custom properties
├─ app.js                 # Client-side JavaScript for data loading and form handling
├─ vercel.json            # Vercel configuration for Python serverless functions
├─ requirements.txt       # Python dependencies
├─ .gitignore            # Git ignore patterns
├─ README.md             # Deployment and setup instructions
├─ robots.txt            # Simple SEO (allows all)
├─ /public
│   ├─ favicon.svg       # Custom favicon with "T" logo
│   ├─ headshot.jpg      # [TO ADD] Hero section photo
│   └─ /projects         # [TO ADD] Project images: <slug>.jpg
├─ /data                 # JSON data files loaded by client JS
│   ├─ projects.json     # Project showcase data
│   ├─ skills.json       # Skills organized by category
│   ├─ leadership.json   # Leadership roles and activities
│   ├─ awards.json       # Awards and recognitions
│   └─ social.json       # Social media links
└─ /api
    └─ contact.py        # Flask serverless function for contact form
```

## Design System

- **Colors**: White/light gray backgrounds, dark gray text, blue accent (#0077B6), burnt orange focus (#C13F03)
- **Typography**: Inter (primary), Merriweather (headings), system fallbacks
- **Components**: Cards with hover lifts, buttons with subtle shadows, visible focus rings
- **Layout**: Responsive grid, mobile-first approach, sticky navigation

## Key Features

1. **Hero Section**: Trevor's name, tagline, CTA buttons for Resume/Contact/LinkedIn/GitHub
2. **About**: Placeholder content for bio, career goals, quick stats
3. **Projects**: Dynamic loading from JSON, max 3 displayed, with repo links
4. **Skills**: Chip-style display grouped by Languages/Frameworks/Tools/Coursework
5. **Leadership**: Card layout for roles and awards
6. **Resume**: Embedded PDF viewer with download option
7. **Contact**: Working form that stores to Supabase and emails via Resend

## Data Management

All content is stored in JSON files in `/data/` directory:
- Projects include title, role, date, description, tech stack, repo URL, image path
- Skills are grouped into 4 categories with array of items
- Leadership includes title, organization, dates, bullet points
- Awards have title and description note
- Social links include LinkedIn, GitHub, email

## Contact Form Integration

- Client-side validation (name, email, message ≥10 chars)
- POST to `/api/contact` Flask endpoint
- Dual storage: Supabase table + Resend email notification
- Environment variables for all API keys and configuration
- No secrets in client code

## Development Commands

This is a static site with serverless functions:
- No build process required for development
- Deploy directly to Vercel from GitHub
- Test locally by serving static files and running Flask for API

## Customization Areas

When updating content, modify these files:
1. **Personal Info** (index.html:27-28) - Name and tagline in hero
2. **Projects** (data/projects.json) - Project showcase content
3. **Skills** (data/skills.json) - Technical skills by category  
4. **Leadership** (data/leadership.json) - Leadership roles and activities
5. **Awards** (data/awards.json) - Recognition and achievements
6. **Social Links** (data/social.json) - LinkedIn, GitHub, email
7. **About Content** (index.html:43-45) - Replace placeholder text

## Assets to Add Later

The following files are referenced but need to be provided:
- `/public/headshot.jpg` - Hero section photo (≤200KB)
- `/public/resume.pdf` - Downloadable resume
- `/public/projects/placeholder-one.jpg` - Project images (≤300KB each)
- `/public/projects/placeholder-two.jpg`
- `/public/projects/placeholder-three.jpg`

## Deployment Setup

1. Push to GitHub repository named "Personal_Portfolio"
2. Connect to Vercel for automatic deployment
3. Configure environment variables in Vercel dashboard
4. Set up Resend domain verification
5. Create Supabase table using provided SQL
6. Upload required assets to appropriate directories

## Environment Variables Required

- `RESEND_API_KEY` - API key from Resend service
- `RESEND_FROM` - Trevor Miller <notify@trevormiller.xyz>
- `RESEND_TO` - tmille12@syr.edu
- `RESEND_REPLY_TO` - Trevor Miller <tmille12@syr.edu>
- `SUPABASE_URL` - https://vuxuyhdhvptswjyumpag.supabase.co
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key from Supabase
- `RESEND_WEBHOOK_SECRET` - (Optional) For webhook verification