

# Re-implement March 10 "Health Scans + Daily Health Passport" Integration

This plan recreates the full Face Scan system and its integration with the Daily Health Passport scoring, based on project memory and existing database schema.

---

## What Was in the March 10 Version

The March 10 version connected the Face Scan page to the Health Passport via two scan modes:
1. **AI Wellness Scan** -- upload/capture a selfie, send to Gemini AI for hydration/rest/vitality scoring, save to `health_scans` table
2. **VitalLens Vitals Scan** -- use VitalLens web components for rPPG-based heart rate, respiratory rate, HRV estimation, save to `vitals_scans` table
3. **Health Passport scoring** -- the `vitals_score` pillar auto-updates based on today's scan results

---

## Implementation Plan

### 1. Create Edge Function: `analyze-face-wellness`
- Accepts a base64 image
- Validates face detection via Gemini vision
- Returns hydration_score, rest_score, vitality_score, encouragement text
- Uses `google/gemini-2.5-flash` via Lovable AI Gateway
- Saves result to `health_scans` table

### 2. Create Storage Bucket: `face-scans`
- For storing uploaded selfie images (private bucket)

### 3. Rebuild `FaceScan.tsx` -- Wellness Tab
- Camera capture via `getUserMedia` with mobile fallbacks (`playsinline`, `muted`, capture attribute)
- Upload photo option
- "Take Selfie" native fallback button
- Send image to `analyze-face-wellness` edge function
- Display results: hydration, rest, vitality scores with encouragement
- Save scan to `health_scans` table
- Show past scan history from `health_scans`

### 4. Rebuild `FaceScan.tsx` -- Vitals Tab
- Integrate VitalLens v0.4.4 web components (`<vitallens-scan>`)
- Parse vitals from `data.vitals.heart_rate.value` (v0.4.x+ API)
- Merge async streams (HR at 5s, RR at 10s, HRV at 20s) without overwriting
- Save to `vitals_scans` table
- Native file fallback when camera unavailable

### 5. Update `useHealthPassport.ts` -- Vitals Score Calculation
- On passport load, query today's `health_scans` and `vitals_scans` for the user
- Calculate vitals_score:
  - Wellness scan: 15 base + 5 bonus = 20 pts max
  - Vitals scan: 15 base + up to 10 bonus (HR + RR quality) = 25 pts max
  - Best of the two is used
- Auto-update passport `vitals_score` and `total_score`

### 6. Update Health Passport Display
- Show "Face Scan" pillar with correct score reflecting today's scans
- Max score label updated to 25 (matching vitals pillar max)

---

## Files to Create/Modify

| File | Action |
|---|---|
| `supabase/functions/analyze-face-wellness/index.ts` | Create -- AI face analysis edge function |
| `src/pages/FaceScan.tsx` | Rewrite -- full scan UI with both tabs |
| `src/hooks/useHealthPassport.ts` | Update -- integrate scan scores into vitals_score |
| `src/hooks/useFaceScan.ts` | Create -- camera, upload, scan logic hook |
| `src/hooks/useVitalsScan.ts` | Create -- VitalLens integration hook |
| Storage bucket `face-scans` | Create via migration |

### Technical Notes
- Edge function uses Lovable AI Gateway (`ai.gateway.lovable.dev`) with `LOVABLE_API_KEY` (already configured)
- VitalLens API key (`VITALLENS_API_KEY`) is already configured as a secret
- No new database tables needed -- `health_scans` and `vitals_scans` already exist with correct schema and RLS policies

