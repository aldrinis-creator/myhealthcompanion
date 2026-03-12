

# Fix: Mobile Login Must Show Password Field

## Problem
The current Mobile tab shows a phone number → OTP flow. But the screenshot clearly shows the Mobile login has:
1. Country code selector + mobile number input
2. **Password field** with show/hide toggle
3. **Forgot password?** link
4. **Sign In** button

This matches the project memory: "All subsequent sign-ins are password-based." Mobile OTP is only for **registration verification**, not for regular sign-in.

## Changes

### `src/pages/Auth.tsx`
- **Mobile login mode**: Show phone number + password fields (same as email but with phone input instead of email input). Sign in using `signInWithPassword` with the dummy email (`{phone}@phone.myhealthcompanion.app`) + password.
- **Mobile sign-up mode**: Show phone number + password, then trigger OTP verification after initial signup.
- Remove the current "Send OTP → Verify OTP" as the default mobile login flow. OTP verification only happens during registration.
- Add forgot password link to mobile form too.

### Auth Flow Summary
| Mode | Email Tab | Mobile Tab |
|------|-----------|------------|
| Sign In | email + password | phone + password (mapped to dummy email) |
| Sign Up | email + password → email verification | phone + password → OTP verification |

