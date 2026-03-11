

## Current State

The project has been reduced to just two pages (Auth + Dashboard). The Activity Tracker and Workout Plan pages that previously existed are **missing from the codebase**. The database tables (`activity_sessions`, `activity_goals`, `workout_plans`) still exist, so no data is lost — only the frontend code needs to be rebuilt.

Additionally, the `package.json` build script fix has failed to persist three times. This is the root cause of the build error.

## Plan

### Step 1: Fix package.json (blocking everything)

Rewrite the full `package.json` file using the write tool (not line_replace, which has been failing) to ensure the `build:dev` script is included.

### Step 2: Create Activity Tracker page (`src/pages/Activity.tsx`)

- **Recent Activity section** with **horizontal scrolling** row of metric cards (Steps, Calories, Active Minutes, Avg HR, Cadence, SpO2, Respiratory Rate, Floors Climbed) — using `overflow-x-auto` with `flex-nowrap` and `snap-x` for smooth mobile scrolling
- Fetches from `activity_sessions` table ordered by most recent
- Each card shows the metric value with an icon and label

### Step 3: Activity Trends with Trendlines (`src/components/ActivityTrends.tsx`)

- Period selector: Daily / Weekly / Monthly
- Recharts `ComposedChart` with:
  - `Bar` or `Area` for actual data (Steps, Active Minutes, Avg HR)
  - `Line` for computed **linear regression trendline** overlaid on the chart
  - Goal reference line (`ReferenceLine`) scaling by period
- Trendline calculation: simple linear regression (slope/intercept) computed from the data points

### Step 4: Add route in App.tsx

- Add `/activity` route as a protected route
- Add navigation link from Dashboard to Activity page

### Technical Details

- Trendline: Linear regression formula `y = mx + b` computed over the data series, rendered as a `Line` in Recharts
- Horizontal scroll: `flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4` with `min-w-[160px] snap-center` on each card
- Data queries via `@tanstack/react-query` + Supabase client, consistent with existing patterns

