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