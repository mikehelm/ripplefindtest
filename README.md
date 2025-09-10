# RippleFind

A viral referral platform that helps founders find co-founders through network effects.

## Features

- Interactive landing page with smooth scrolling sections
- Dynamic name parsing from URL paths
- Responsive design with dark mode support
- Animated ripple effects and micro-interactions
- Built with Next.js, TypeScript, and Tailwind CSS

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment on Netlify with the included `netlify.toml` configuration.

### Deploy to Netlify

1. Push this repository to GitHub
2. Connect your GitHub repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`
4. Deploy!

## Project Structure

- `/app` - Next.js 13+ app directory with pages and layouts
- `/components` - Reusable React components
- `/lib` - Utility functions and configurations
- `/public` - Static assets

## Environment Variables

Copy `.env.example` to `.env.local` and configure your environment variables.

## Tech Stack

- **Framework:** Next.js 13+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React
- **Animations:** CSS animations + Framer Motion ready

## Database Migrations

To apply Supabase migrations locally via `psql`:

1) Set `SUPABASE_DB_URL` in your shell or `.env.local`:

```bash
export SUPABASE_DB_URL="postgresql://postgres:<DB_PASSWORD>@db.<ref>.supabase.co:5432/postgres"
# or in .env.local:
# SUPABASE_DB_URL="postgresql://postgres:<DB_PASSWORD>@db.<ref>.supabase.co:5432/postgres"
```

Find this in Supabase → Project Settings → Database → Connection string → `psql`.

2) Apply the initial schema migration:

```bash
npm run db:apply:init
```

3) Restart the API server:

```bash
npm run server
```

## Dev

Start UI: `npm run dev` (http://localhost:4000)

Backend API: Render (https://ripplefind-api.onrender.com)

Do not run `npm run server` locally; the app uses the live API.

Env: define the following in `.env.local` (no trailing slash on API base):

```
NEXT_PUBLIC_SUPABASE_URL=https://lmaeksolipgytgphxzsg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtYWVrc29saXBneXRncGh4enNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDc4OTEsImV4cCI6MjA3Mjk4Mzg5MX0.R7h3xFWlNeuFw6Is6lOK3thSnWp1-7XkgU84sKzJJHY
NEXT_PUBLIC_API_BASE=https://ripplefind-api.onrender.com