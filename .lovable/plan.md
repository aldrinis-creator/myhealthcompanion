

# Fix Settings.tsx Build Error

## Problem
`src/pages/Settings.tsx` has duplicate closing markup at lines 204-209 (a copy of lines 198-203), causing 4 TypeScript parse errors that break the build.

## Fix
**File: `src/pages/Settings.tsx`** — Remove lines 204-209 (the duplicate `</main>`, `<AppFooter />`, `</div>`, `);`, `};`).

This is a one-line fix that will resolve all 4 build errors immediately.

