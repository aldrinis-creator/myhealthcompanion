

# Login Page UI Restoration

Based on your screenshot, the original login page has a significantly different design from the current one. Here's what needs to change:

## Current vs Original

| Feature | Current | Original (Screenshot) |
|---|---|---|
| Role selector | None | **User / Guardian** toggle tabs at top |
| Login method | Email only | **Email / Mobile** toggle tabs |
| Heart icon | Small, in colored box | Large, filled teal circle with white heart |
| Title | "MyHealthCompanion" | **"Welcome Back"** |
| Subtitle | "Sign in to your account" | **"Sign in to access your health records"** |
| Forgot password | None | **"Forgot password?"** link |
| Input labels | Above inputs | **Placeholder-only** inside inputs with icons |
| Card style | White with shadow | White with subtle **rounded-2xl** shadow |

## Implementation

### Rewrite `src/pages/Auth.tsx`
- **User/Guardian toggle** — pill-shaped segmented control at top (User selected = filled teal, Guardian = outline). Guardian mode will sign in with `guardian_user_id` flow later; for now just visual toggle.
- **Email/Mobile tabs** — second segmented control below the title. Email tab shows email+password fields. Mobile tab shows phone number + OTP field (using existing OTP auth from memory).
- **Heart icon** — large filled teal circle (`bg-primary`) with white `Heart` icon centered above the card.
- **"Welcome Back" / "Sign in to access your health records"** headings.
- **Forgot password?** link below password field, navigates to password reset flow.
- **Rounded pill-style Sign In button** — full width, teal.
- **"Don't have an account? Sign up"** at bottom.

### Sign Up Mode
- When toggling to Sign Up, show the two-step registration (per memory: Step 1 identity + OTP, Step 2 guardian nomination). For now, implement Step 1 with email/mobile + password.

### Mobile Auth Support
- Mobile tab: phone input field, sends OTP via `supabase.auth.signInWithOtp({ phone })`, then shows OTP verification input.
- Maps to dummy email format per project memory.

### No new dependencies needed
- All UI built with existing Tailwind classes and Lucide icons.
- Add `Smartphone` icon from lucide-react for the Mobile tab.

### Files
- **Rewrite**: `src/pages/Auth.tsx` — complete redesign matching screenshot
- **No other files affected** — routing and auth hook remain the same

