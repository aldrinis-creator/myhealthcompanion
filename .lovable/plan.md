

# Fix GitHub Pages Blank Page (While Keeping Lovable Hosting Working)

## Problem
GitHub Pages serves the app from a subpath (`/repo-name/`), but the current config has no `base` path and the SPA router has no `basename`. Assets and routes resolve to `/` which is the GitHub Pages root — not where the app lives. Result: blank page.

Meanwhile, Lovable hosting works fine at the root `/`.

## Solution
Use Vite's environment mode to conditionally set the `base` path only for GitHub Pages builds, and pass the basename to React Router.

### 1. Update `vite.config.ts`
- Read an env variable (e.g. `VITE_BASE_PATH`) or use a conditional based on build mode
- For simplicity, use `process.env.GITHUB_PAGES` or check `mode`:
  ```ts
  base: process.env.GITHUB_PAGES ? '/MyHealthCompanion/' : '/'
  ```

### 2. Add `404.html` for GitHub Pages SPA support
- GitHub Pages doesn't support SPA routing natively
- Create `public/404.html` with a redirect script that rewrites the URL to use query params, then `index.html` picks it up

### 3. Add SPA redirect script to `index.html`
- Parse the query-string redirect from `404.html` and replace the URL before React mounts

### 4. Update `BrowserRouter` in `main.tsx`
- Pass `basename` from an env variable so routes work under the subpath on GitHub Pages

### 5. Add GitHub Actions workflow (optional)
- `.github/workflows/deploy.yml` to build with `GITHUB_PAGES=true` and deploy to `gh-pages` branch

---

### Technical detail

The approach uses a single codebase with conditional base path:

```text
Lovable build:  base = "/"          → myhealthcompanion.lovable.app/
GitHub build:   base = "/repo-name/" → username.github.io/repo-name/
```

The `404.html` trick is the standard pattern for SPAs on GitHub Pages — it converts `/repo/dashboard` into `/repo/?/dashboard`, then `index.html` restores the real path via `history.replaceState` before React mounts.

### Files to create/modify
- `vite.config.ts` — conditional `base`
- `src/main.tsx` — conditional `basename` on `BrowserRouter`
- `public/404.html` — SPA redirect for GitHub Pages
- `index.html` — redirect restoration script
- `.github/workflows/deploy.yml` — automated GitHub Pages deployment

