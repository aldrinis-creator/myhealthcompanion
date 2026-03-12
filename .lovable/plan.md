

# Full Rebuild Plan — MyHealthCompanion

Based on the 44 database tables, project memories, and existing configuration, here is the comprehensive rebuild plan. This is a large application — we'll build it in phases across multiple messages.

## Phase 2: Core Feature Pages (This Session)

Building on the existing foundation (auth + dashboard), we'll add the main feature pages referenced in the sidebar navigation.

### 2A. Medications Page (`/medications`)
- List active medications with name, dosage, scheduled times, severity indicator
- Add/edit medication dialog (name, dosage, composition, scheduled_times, total_quantity, current_quantity, severity)
- Medication log tracking (taken/missed/snoozed status)
- Stock level indicator with low-stock warnings
- Tables: `medications`, `medication_logs`

### 2B. Vitals Page (`/vitals`)
- History of vitals scans (heart_rate, respiratory_rate, hrv_sdnn, hrv_rmssd)
- Recharts line charts for trends over time
- Manual entry form for new scans
- Table: `vitals_scans`

### 2C. Appointments Page (`/appointments`)
- List view of upcoming/past appointments
- Add/edit appointment dialog (title, date, time, doctor_name, location, type, recurrence, alerts)
- Doctor confirmation status display
- Table: `appointments`

### 2D. Activity Page (`/activity`)
- Activity sessions list with steps, distance, duration, calories
- Daily goals display and editing (steps, active minutes, move hours)
- Workout plans overview
- Tables: `activity_sessions`, `activity_goals`, `workout_plans`

### 2E. Profile Page (`/profile`)
- Personal info (first_name, last_name, date_of_birth, blood_type, gender, weight, height)
- Medical info (allergies, medical_conditions, food_preference)
- Doctor details, insurance info
- Emergency contacts
- Settings (preferred_language, medication_window, nudge_interval, weekly_report)
- Table: `profiles`

## Phase 3: Advanced Features (Future Sessions)
- Guardian system (guardians table, exchanges, ambulance requests)
- Care Journal (care_journal_entries)
- Teleconsultations & video calls
- Document vault (vault_items, important_documents, medical_documents)
- Health passport & wellness scoring
- Health scans & personas
- Loyalty points & prizes
- Operation tracking
- SOS / emergency features
- Data privacy requests

## Technical Approach
- Each page as a lazy-loaded route component
- Tanstack Query for all data fetching with proper cache keys
- shadcn/ui dialogs and forms for CRUD operations
- Recharts for vitals/activity charts
- All queries scoped to authenticated user (RLS enforced)
- Progressive rendering for heavy pages (per project memory)
- No schema changes needed — all tables exist with proper RLS

## Files to Create/Modify
- `src/App.tsx` — add routes for all Phase 2 pages
- `src/pages/Medications.tsx`
- `src/pages/Vitals.tsx`
- `src/pages/Appointments.tsx`
- `src/pages/Activity.tsx`
- `src/pages/Profile.tsx`
- Supporting components in `src/components/` as needed

## Implementation Order
1. Medications page (most used daily feature)
2. Appointments page
3. Vitals page
4. Activity page
5. Profile page

Each page will be fully functional with CRUD operations, not just display.

