# ClipInvoice

> Invoicing built for YouTube editors. Not accountants.

ClipInvoice is a lightweight brand deal tracking tool for YouTube editors and creators. Create professional deal proposals, share them with brands via a unique link, and track payment status — all in one place.

## Features

- Create brand deals with deliverables in under 2 minutes
- Generate a clean shareable link for sponsors
- Auto-tracks when a brand views your deal
- Mark deals as sent, viewed, or paid
- Simple dashboard to manage all your deals

## Tech Stack

- Next.js 14
- Supabase (auth + database)
- Tailwind CSS
- TypeScript

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your Supabase credentials:

  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

4. Run the dev server: `npm run dev`
5. Open http://localhost:3000
