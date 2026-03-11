

## Diagnosis

The app at myhealthcompanion.lovable.app is broken because:

1. **`package.json` still has the old scripts** — `build:dev` is missing and `build` still includes `tsc &&`. This has failed to persist across multiple attempts using `line_replace`. The build cannot succeed without this fix.

2. **The app has been reduced to only 2 pages** (Auth + Dashboard). Previously built pages (Activity, Workout, etc.) are missing from the codebase, though the database tables remain intact.

## Plan

### Step 1: Overwrite `package.json` entirely

Use the `write` tool (not `line_replace`) to rewrite the full file, ensuring the scripts block is:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "preview": "vite preview"
}
```

This is the **blocking issue** — nothing else matters until this is fixed. The `line_replace` approach has failed 3+ times; a full file write should force the change.

### Step 2: Create Activity Tracker page with horizontal scrolling and trendlines

Create `src/pages/Activity.tsx` with:
- Horizontal scrolling recent activity cards (`overflow-x-auto flex-nowrap snap-x`)
- Fetches from `activity_sessions` table

Create `src/components/ActivityTrends.tsx` with:
- Period selector (Daily/Weekly/Monthly)
- Recharts `ComposedChart` with bars for data + `Line` for linear regression trendline
- Simple `y = mx + b` calculation over the data points

### Step 3: Add route in `App.tsx`

- Add `/activity` as a protected route
- Add navigation from Dashboard to Activity page

