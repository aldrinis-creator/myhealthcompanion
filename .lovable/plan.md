

## Fix: ActivityWorkout Page Freezing on Exit

### Root Cause Analysis

The ActivityWorkout page uses framer-motion animations that don't cleanly unmount when navigating away. Combined with the destination page (MyHealth) simultaneously mounting 9 animated grid tiles, this creates a main-thread bottleneck — the browser stalls processing exit animations and entry animations at the same time.

### Changes

**1. Wrap route transitions with `AnimatePresence` in App.tsx**
- Import `AnimatePresence` from framer-motion around the `Routes` component to properly handle exit animations and prevent orphaned animation frames.

**2. Simplify ActivityWorkout animations**
- Replace the current `motion.div` cards with simpler CSS transitions (`transition-opacity`) instead of framer-motion, since this page is lightweight and doesn't need JS-driven animation.
- This eliminates framer-motion's animation loop from persisting during unmount.

**3. Optimize MyHealth grid mounting**
- Stagger the 9 `motion.button` items using a single parent `motion.div` with `staggerChildren` instead of individual `fadeIn` on each button. This batches the animation work.
- Add `will-change: transform` to the grid container for GPU compositing.

**4. Add navigation transition guard**
- In ActivityWorkout, use `useCallback` for the back navigation and add a small `requestAnimationFrame` wrapper before calling `navigate()` to let the current frame complete before triggering the route change.

### Technical Details

Files modified:
- `src/pages/ActivityWorkout.tsx` — remove framer-motion, use CSS transitions, wrap navigate in rAF
- `src/pages/MyHealth.tsx` — use staggerChildren pattern, add will-change
- `src/App.tsx` — add AnimatePresence wrapper

No database or backend changes required.

