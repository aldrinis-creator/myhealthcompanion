

## Problem

The `package.json` scripts section (lines 6-9) is missing the `build:dev` script that Lovable requires, and the `build` script includes `tsc &&` which causes TypeScript compilation failures.

The preview actually IS showing the correct app (the auth/login page), but the build keeps failing so it can't deploy.

## Fix

Replace lines 6-9 in `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "preview": "vite preview"
}
```

This adds the required `build:dev` script and removes `tsc &&` from build.

