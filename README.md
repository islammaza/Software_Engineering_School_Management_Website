# School Management Website

A React + Vite web app for managing a school/group workflow (groups, students, modules, dashboard). The UI is Arabic-first.

## Features

- Authentication (Signup/Login) with a simple local session
- Groups management (list, add, edit, details)
- Students management inside a group (add, edit, details)
- Modules management inside a group (add/edit/details)
- Dashboard + Settings

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- TanStack Query
- Supabase (data)
- Tailwind + shadcn/ui

## Getting Started (Developers)

### Requirements

- Node.js (recommended LTS)
- npm

### Install

```bash
npm install
```

### Run (development)

```bash
npm run dev
```

Vite will start the app (configured to use port 8080).

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Testing

This project uses **Vitest** + **React Testing Library** for unit and integration tests.

```bash
# watch mode
npm test

# CI mode
npm run test:run

# UI runner
npm run test:ui

# coverage
npm run test:coverage
```

## User Guide (Admin)

This guide describes the typical workflow for an admin user.

### 1) Create an account (Signup)

1. Open the app.
2. Go to **إنشاء حساب جديد**.
3. Enter admin details and submit.
4. After a successful signup, proceed to login.

### 2) Login

1. Open **تسجيل الدخول**.
2. Enter email + password.
3. After successful login you will be redirected to **Groups**.

Tip: If you are already logged in, visiting `/login` will redirect you to `/groups`.

### 3) Groups

- View all groups from the Groups page.
- Add a group: open “Add Group” and submit the form.
- Open a group: click a group to view **Group Details**.
- Edit a group: use the edit action on the group.

### 4) Students (inside a group)

From **Group Details**:

- Add a student: open “Add Student”, fill the form, and submit.
- View student: open the student details page.
- Edit student: open “Edit Student” and update fields.

Notes:

- The system checks duplicates using (name + phone + birthdate) within the same group.

### 5) Modules (inside a group)

From **Group Details**:

- Add a module: open “Add Module” and submit.
- Edit a module: open “Edit Module” and submit.
- View module details: open the module details page.

### 6) Dashboard

- Open **Dashboard** to view high-level information and quick navigation.

### 7) Settings & Logout

- Open **Settings** to manage admin preferences.
- To logout, use the logout action (it clears local session data).

## App Routes (Reference)

Common routes:

- `/` Landing
- `/login` Login
- `/signup` Signup
- `/groups` Groups (protected)
- `/groups/:id` Group details (protected)
- `/groups/:groupId/students/:studentId` Student details (protected)
- `/groups/:id/modules/:moduleId` Module details (protected)
- `/dashboard` Dashboard (protected)
- `/settings` Settings (protected)

## Troubleshooting

- If you see a blank page after login, clear site data (localStorage) and login again.
- If build/test fails, run `npm install` again and retry.
