# Dentist Clinic Management System

A modern, full-stack dental clinic management application built with Next.js 16, Supabase, and NextAuth.

## Features

- 🦷 **Patient Management** - Register and manage patient records
- 📅 **Appointment Scheduling** - Book and manage appointments with flexible time slots
- 👨‍⚕️ **Doctor Dashboard** - View today's appointments and patient history
- 📋 **Treatment Records** - Document diagnosis, prescriptions, and follow-up notes
- 🔐 **Role-Based Access** - Separate interfaces for doctors and receptionists
- 🎨 **Modern UI** - Built with Tailwind CSS and Framer Motion

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth v5
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Quick Start

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Supabase Database

Follow the detailed instructions in [SUPABASE_MIGRATION.md](SUPABASE_MIGRATION.md):

1. Create a Supabase project
2. Run the SQL schema from `supabase-schema.sql`
3. Configure environment variables
4. Create initial user accounts

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and update with your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `AUTH_SECRET` - Generate with `npx auth secret`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## User Roles

### Doctor
- View today's appointments
- Access patient treatment history
- Create and update treatment records
- Document diagnosis and prescriptions

### Receptionist
- Schedule new appointments
- Search and manage patients
- Update appointment statuses
- Reschedule or cancel appointments

## Project Structure

```
src/
├── actions/          # Server actions for data operations
├── app/             # Next.js app router pages
├── components/      # React components
├── lib/            # Utility functions and configs
├── models/         # TypeScript interfaces (legacy)
└── types/          # Type definitions
```

## Database Schema

The application uses the following main tables:
- `users` - Doctors and receptionists
- `patients` - Patient information
- `appointments` - Appointment scheduling
- `treatment_records` - Medical records
- `treatments` - Treatment types and pricing

See [supabase-schema.sql](supabase-schema.sql) for complete schema.

## Utilities

### Generate Password Hash

To create bcrypt password hashes for new users:

```bash
node scripts/generate-password-hash.js yourPassword
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
