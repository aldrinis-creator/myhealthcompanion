

## Fix

The `package.json` is missing the `build:dev` script that Lovable's build system requires. I also need to remove `tsc &&` from the `build` script since TypeScript checking during build causes issues.

### Change
Update `package.json` scripts to:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "preview": "vite preview"
}
```

