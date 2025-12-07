# RSVP Platform

A modern, premium RSVP and event coordination platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎉 **Multi-Session Events** - Create weddings, trips, parties, and more with multiple sessions
- 👥 **Guest Management** - Organize guests into households and groups
- 📱 **Beautiful RSVP Pages** - Mobile-first, personalized experiences
- 🎨 **Custom Branding** - Match your event's aesthetic
- 📊 **Analytics & Exports** - Track responses and export data
- 🔐 **Secure Authentication** - Magic link login for hosts

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd RSVP_Tool
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

- Create a new project at [supabase.com](https://supabase.com)
- Run the migration in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
- Copy your project URL and anon key

4. **Configure environment variables**

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── app/               # Protected host dashboard
│   ├── auth/              # Authentication callbacks
│   ├── login/             # Login page
│   ├── r/                 # Guest RSVP pages
│   └── page.tsx           # Landing page
├── components/            # React components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and helpers
│   ├── api/               # Server actions
│   ├── supabase/          # Supabase clients
│   └── validations/       # Zod schemas
└── supabase/              # Database migrations
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel (recommended)

## Database Schema

The platform uses the following main tables:

- `users` - Host accounts
- `events` - Event definitions
- `event_themes` - Branding and styling
- `households` - Guest family units
- `guests` - Individual guests
- `event_sessions` - Sessions within events
- `rsvps` - RSVP responses
- `questions` - Custom questions
- `responses` - Guest answers

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## Development

```bash
# Run development server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build
```

## Deployment

The easiest way to deploy is with [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your environment variables
4. Deploy!

## License

MIT
