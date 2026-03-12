

# Rebuild MyHealthCompanion — Phase 1: Core Foundation

Since the source code cannot be recovered from History, we'll rebuild the application incrementally using your existing 44+ database tables. This plan covers only **Phase 1** — the essential foundation and most important features.

## What We'll Build First

### 1. Project Foundation
- `package.json` with all dependencies (React, Vite, Tailwind, shadcn/ui, Recharts, React Router, Tanstack Query, Supabase client)
- `index.html`, `vite.config.ts`, `tailwind.config.ts`, `tsconfig` files, `postcss.config.js`
- `src/main.tsx`, `src/App.tsx` with routing setup
- Build scripts including `build:dev` per project memory

### 2. Authentication System
- Login and signup pages at `/auth`
- Email-based authentication using the existing auth system
- Protected route wrapper
- Auth context/hook for session management

### 3. Main Health Dashboard
- Dashboard layout with sidebar navigation
- Wellness score overview (using `wellness_scores` table)
- Medication adherence summary (using `medications`, `medication_logs` tables)
- Recent vitals display (using `vitals` table)
- Upcoming appointments (using `appointments` table)
- Activity summary cards (using `activities` table)

### 4. Core Navigation Structure
- Sidebar with links to: Dashboard, Medications, Vitals, Appointments, Activities, Profile
- Responsive layout with mobile support
- User profile menu with logout

## Technical Approach
- Reuse all existing database tables — no schema changes needed
- shadcn/ui components for consistent UI
- Recharts for health data visualization
- Tanstack Query for data fetching and caching
- All pages behind authentication with RLS enforcement

## What Comes Later (Future Phases)
- Medication management (add/edit/log)
- Vitals tracking and scanning
- Activity/workout tracking
- Appointments management
- Teleconsultation features
- Guardian system
- Care journal, health personas, document vault
- Loyalty/prizes system

This first phase will give you a working, authenticated dashboard that connects to your existing data. We can then add features one by one.

