# Personal Portfolio (Single Page)

## Quick Start
1) Push this repo (Personal_Portfolio) to GitHub.
2) Import to Vercel and deploy.
3) In Vercel → Settings → Environment Variables, add:
   - RESEND_API_KEY = (your key)
   - RESEND_FROM = Trevor Miller <notify@trevormiller.xyz>
   - RESEND_TO = tmille12@syr.edu
   - RESEND_REPLY_TO = Trevor Miller <tmille12@syr.edu>
   - SUPABASE_URL = https://vuxuyhdhvptswjyumpag.supabase.co
   - SUPABASE_SERVICE_ROLE_KEY = (service role key)
   - (Optional later) RESEND_WEBHOOK_SECRET = (random string)
4) In Resend, verify your domain trevormiller.xyz (SPF/DKIM per Resend UI).
5) In Supabase, create table `contact_submissions` using the SQL below.

## Supabase SQL
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new'
);

-- Optional: RLS can remain disabled for this table if only accessed by service role in serverless.
-- Do NOT expose the service role key in client code.

## Images to Add Later
- /public/headshot.jpg
- /public/hero-background.png (hero section background image)
- /public/projects/<slug>/{1..5}.jpg
Keep hero ≤ 200KB, project images ≤ 300KB, background ≤ 500KB (~1920x1080).

## Notes
- Do not commit secrets; use Vercel env vars only.
- Contact API both stores to Supabase and emails via Resend.
- No analytics, minimal SEO (robots.txt only).