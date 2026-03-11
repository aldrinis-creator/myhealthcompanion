

## Fix package.json (build:dev script)

The `package.json` still has the old scripts. The edit needs to target lines 6-9 precisely.

### Change
Replace lines 6-9 in `package.json`:
```json
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
```
With:
```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "preview": "vite preview"
  },
```

