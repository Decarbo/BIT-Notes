# BIT-Notes — Project Overview

A compact summary and quick-start for the BIT-Notes project.

## What is this

BIT-Notes is a Next.js application (app router, TypeScript) that provides a curated public archive of study notes and files. It includes: a searchable feed, per-note viewing, user authentication, and bookmarking/saving of notes. The UI uses Tailwind CSS with a brutalist/neubrutal design language.

## Key features

-  Public notes feed with search, filtering, and pagination
-  Bookmarking system per authenticated user
-  Community / contributed notes section
-  File viewing via external file URLs
-  Server-side API routes for uploading and handling notes (Supabase backing)

## Tech stack

-  Next.js (app directory)
-  TypeScript
-  Tailwind CSS
-  React Query (@tanstack/react-query) for data fetching and caching
-  Supabase (Postgres + Auth + Storage)
-  Lucide icons & Heroicons

## Quick start (development)

1. Install dependencies

   -  Open a terminal in the project root and run:
      -  npm install

2. Environment variables

   Create a .env.local file in project root with values required by Supabase and Next.js. Typical variables:

   -  NEXT_PUBLIC_SUPABASE_URL
   -  NEXT_PUBLIC_SUPABASE_ANON_KEY
   -  SUPABASE_SERVICE_ROLE_KEY (only for server-side scripts if used)

3. Run the dev server

   -  npm run dev

4. Build for production

   -  npm run build
   -  npm start

## Project layout (important files)

-  app/ — Next.js app directory: routes, pages and components
   -  app/notes/page.tsx — Public notes feed (main list, pagination, search, bookmarking)
   -  app/api/upload-pdf/route.ts — Example server route for uploads
-  lib/ — shared utilities and clients (supabase client, queries, auth hooks)
-  public/ — static assets
-  tailwind.config.js, next.config.ts, tsconfig.json — core config files

## Development notes

-  Data fetching uses React Query; prefer using the existing hooks in `lib/queries` when adding features.
-  The app uses a client-side `useAuth` hook to gate actions like bookmarking — redirect to `/login` for unauthenticated users.
-  Keep UI consistent with the `neubrutal` utility classes already used in the codebase.

## Contributing

-  Open an issue for bugs or feature requests.
-  Fork, implement, and submit a PR with a short description of changes.
-  Run formatting and linting before submitting (project may include ESLint/Prettier configs).

## License

Add a LICENSE file to the repo and choose a license (e.g., MIT) if you plan to open-source the project.

---

Generated project overview for quick onboarding and documentation. Update environment variable names and scripts to match your `package.json` if they differ.
