

# Restore March 10 Features — Batch 1 Analysis

## Screens Identified from Screenshots

| Screenshot | Screen | Current Status |
|---|---|---|
| image-5 | Auth/Login | **Matches** — User/Guardian toggle, Email/Mobile tabs, same layout |
| image-6 | Dashboard/Home | **Partially differs** — Health Dashboard card shows "Wellness 70" + "Meds 93%" side-by-side, current code shows "Daily Health Passport" with circular score |
| image-7 | My Health grid | **Matches** — 3x3 grid with auto-nav preview card |
| image-8 | Medications (My Tablets) | **Missing features** — Screenshot shows "Today's Schedule" with date, "Taken" buttons, reminder bell icons (5m/15m), "Scan Prescription for Savings" collapsible. Current code is inventory-only |
| image-9/10/11 | Health Tools grid | **Matches** layout |
| image-12 | Health Tools (bottom) | **Missing** — "Emergency First Aid" card at bottom of Health Tools |
| image-13/14 | Doctor Visit Report | **Missing** — No DoctorVisitReport page exists. Shows patient info, vitals, medications, PDF export, Share |

## What Needs to Be Built/Restored

### 1. Dashboard — Health Dashboard Card
Replace or add the "HEALTH DASHBOARD" card showing:
- Side-by-side: Wellness score (heart icon, score, trend) + Meds adherence (pill icon, %, "7-day avg")
- Links to My Health section
- Keep existing Daily Health Passport card below it

### 2. Medications — Today's Schedule View
Add to current Medications page:
- "Today's Schedule" section with current date header
- Medication cards with: "Taken" toggle button, composition in parentheses, severity badge (High/Normal)
- Reminder bell icons showing snooze intervals (5m, 15m) with counter (0/3)
- "Scan Prescription for Savings" collapsible section
- Uses existing `medication_logs` table for tracking taken status

### 3. Health Tools — Emergency First Aid Card
Add at bottom of Health Tools grid:
- "Emergency First Aid" card with heart icon, pink/rose background
- Description: "Quick access to life-saving first aid guides"
- Emergency disclaimer text

### 4. Doctor Visit Report Page
Create new page `src/pages/DoctorVisitReport.tsx`:
- Patient Information section (name, age, gender, blood type, allergies, medical conditions from `profiles` table)
- Latest Vitals section (BP, HR, SpO2, Temperature, Blood Sugar, Respiratory Rate from `vitals` table)
- Risk Level indicator
- Medications section with adherence percentage (30-day) and priority badges
- PDF download (jsPDF) and Share (Web Share API)
- Route: `/doctor-visit-report`

## Files to Create/Modify

| File | Action |
|---|---|
| `src/pages/Dashboard.tsx` | Add Health Dashboard card (Wellness + Meds) |
| `src/pages/Medications.tsx` | Add Today's Schedule, Taken tracking, reminder icons |
| `src/pages/HealthTools.tsx` | Add Emergency First Aid card + onclick handlers for tools |
| `src/pages/DoctorVisitReport.tsx` | Create — full report page with PDF/Share |
| `src/App.tsx` | Add `/doctor-visit-report` route |

## Recommendation

Before I implement these 4 changes, please upload the next batch of screenshots so I can identify all missing features at once. This way we can do a single comprehensive restoration pass rather than multiple incremental ones that risk conflicts.

Alternatively, I can start implementing these 4 items now and handle additional batches after.

