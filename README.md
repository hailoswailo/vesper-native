# Vesper

Invite-only networking + health goal tracking for men taking their faith,
bodies, relationships, and work seriously. See the brand & product brief in
the project docs for the full concept.

## Stack

- Expo SDK 57 + React Native + TypeScript
- Expo Router, with `Stack.Protected` gating the Apply → Pending → member app
  flow
- Data layer: a `Repository<T>` interface, currently backed by AsyncStorage
  (`src/lib/repository.ts`) — swappable for Supabase later without touching
  screens
- Fonts: Cormorant Garamond (display) + Raleway (body), via
  `@expo-google-fonts/*`

## How the flow works

1. Anyone opens the app and lands on **Apply** (`src/app/apply.tsx`) — a
   short form.
2. Submitting creates an `Application`. If the email matches `ADMIN_EMAIL`
   (`src/lib/seed.ts`, currently `hdc@pulchritudemedia.com`), it's
   auto-approved and a `Member` record is created immediately — this solves
   the bootstrap problem without a real backend.
3. Everyone else lands on **Pending** (`src/app/pending.tsx`) until an admin
   approves them from the **Profile** tab's review queue.
4. Approved members get the tab app: **Home** (greeting, active goal,
   streak), **Directory** (browse other approved members), **Goals** (set
   one active goal per pillar, daily check-in builds a streak), **Profile**
   (your info, sign out, and — for admins — the review queue).

Five demo members are seeded on first launch so the Directory isn't empty.

"Sign out" only forgets the current device's session (`vesper.session` in
AsyncStorage) — it doesn't delete any data, so a second person can apply on
the same device and land correctly on Pending.

## Local development

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone, or press `w` for
web.

Typecheck: `npx tsc --noEmit`

## Status / next steps

- [x] Core flow rebuilt and verified (tsc clean, full click-through tested)
- [ ] Real auth (magic link/OTP) to replace the local-device-only session
- [ ] Supabase wired in for real persistence across devices
- [ ] Confirm bundle ID against App Store Connect, `eas build` → TestFlight
- [ ] Apple IAP / subscription wiring ($19.99/mo, $149.99/yr) once past v1

Bundle identifier is currently `com.pulchritudemedia.vesper` — confirm this
matches (or replaces) whatever's already in App Store Connect before
building, so it updates the existing TestFlight listing instead of creating
a new one.
