# Quran School Management Website

An Arabic-first school management platform built with React, Vite, TypeScript, Tailwind CSS, and Supabase. The app is designed for Quran schools and memorization centers that need a clean way to manage groups, students, study modules, performance reports, and admin access from one place.

## Why This Project Stands Out

- Built for real Quran-school workflows, not a generic dashboard clone
- Arabic-first interface with a polished, modern visual style
- Role-based protected areas for authenticated admin users
- Group, student, and module management in one connected flow
- Dashboard analytics that make progress easy to understand at a glance
- PDF report generation for student records and summaries
- Responsive layout that works well on desktop and mobile
- Supabase-backed data layer with test coverage around core utilities

## Main Functionalities

### Authentication

- Signup and login screens for school administrators
- Simple local session handling after successful authentication
- Protected routes that block access to internal pages when the user is not signed in

### School and Group Management

- Create, edit, and view groups
- Browse all groups from a central groups page
- Open group details to manage related data in context

### Student Management

- Add students directly to a group
- Edit and view student profiles
- Detect duplicate students using identity fields in the current group
- Export student reports as PDF for sharing or archiving

### Module Management

- Add learning modules to a group
- Edit module information and assessments
- View module-specific details and progress

### Dashboard and Insights

- High-level school overview
- Student and group performance metrics
- Module averages and grade distribution charts
- Highlight top performers and students who need follow-up

### Settings and Session Controls

- Update admin-facing settings
- Log out cleanly and clear cached session data

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Supabase
- Tailwind CSS
- shadcn/ui
- Recharts
- Vitest and React Testing Library

## Project Structure

The repo is organized to keep the app easier to scan and maintain:

```text
src/
  app/            application shell and route setup
  components/
    auth/           protected route guards
    layout/         dashboard shell and navigation layout
    shared/         reusable decorative or cross-screen components
    ui/             shadcn/ui components
  hooks/
  lib/
    api/            data access helpers
    pdf/            PDF export utilities
    auth.ts         session helpers
    supabaseClient.ts
  pages/            route-level screens
  test/             MSW and test setup
public/             static assets, fonts, icons, robots file
```

## Routes

Public routes:

- `/` landing page
- `/login`
- `/signup`

Protected routes:

- `/dashboard`
- `/groups`
- `/groups/add`
- `/groups/:id`
- `/groups/:id/edit`
- `/groups/:groupId/students/add`
- `/groups/:groupId/students/:studentId`
- `/groups/:groupId/students/:studentId/edit`
- `/groups/:id/modules/add`
- `/groups/:id/modules/:moduleId`
- `/groups/:id/modules/:moduleId/edit`
- `/settings`

## Getting Started

### Requirements

- Node.js 18 or newer
- npm

### Install

```bash
npm install
```

### Environment Variables

Create a local `.env` file based on the included example:

```bash
cp .env.example .env
```

Set the following values:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

### Run the App

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## Testing

This project uses Vitest and React Testing Library.

```bash
npm test
npm run test:run
npm run test:ui
npm run test:coverage
```

## Testing Notes

- The current test setup includes MSW-based server mocks
- Core helpers such as auth utilities and student API logic already have tests
- If you add new flows, keep the test coverage close to the user journey

## File Layout Highlights

- `src/app/App.tsx` owns the route tree
- `src/components/layout/DashboardLayout.tsx` wraps protected admin pages
- `src/components/auth/ProtectedRoute.tsx` guards authenticated routes
- `src/components/shared/IslamicOrnament.tsx` centralizes the decorative separator used on branding screens
- `src/lib/supabaseClient.ts` now reads from environment variables with safe fallbacks

## Deployment Ready Notes

- The project title and meta tags are set for a public GitHub presence
- Supabase credentials are configurable through environment variables
- Static assets, icons, and fonts are already organized under `public/`
- The app is suitable for Vercel or any other Vite-compatible hosting platform

## Suggested Next Improvements

- Replace local session storage with a more secure auth strategy
- Move the remaining page groupings into feature-based folders if you want even stricter separation
- Add screenshots or a short demo GIF to make the GitHub page more persuasive

## License

No license has been added yet. If you plan to publish the repository publicly, add one before sharing it widely.
