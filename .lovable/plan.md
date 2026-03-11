

## Fix Build Error

The `package.json` is missing the `build:dev` script that the platform requires.

### Change
Add `"build:dev": "vite build --mode development"` to the scripts section of `package.json`.

This is a one-line fix that will resolve the build error immediately.

