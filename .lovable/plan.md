

## Fix

The `package.json` still has `"build": "tsc && vite build"` and is missing `build:dev`. The previous edit didn't persist. I need to update the scripts section:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "preview": "vite preview"
}
```

This is a one-line change in `package.json` (lines 6-10).

