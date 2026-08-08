# Shipping to TestFlight

This has to run from a machine with normal internet access — the cloud
sandbox this project was built in only has network access to an allowlisted
set of hosts (GitHub, npm, Supabase), and neither `expo.dev` nor
`appstoreconnect.apple.com` are on that list, so `eas build`/`eas submit`
fail outright from there. Run these from your own Mac (Terminal, or ask
your local Claude Code to drive it — either works).

## One-time setup

```bash
git clone https://github.com/hailoswailo/vesper-native.git
cd vesper-native
npm install
npm install -g eas-cli
```

Put your App Store Connect API key at `./credentials/AuthKey_HK557NVXSK.p8`
(the file is gitignored on purpose — a private key should never live in a
repo, even a private one). If you don't still have that file, generate a
fresh key at App Store Connect → Users and Access → Integrations →
App Store Connect API, and update the key ID in `eas.json` to match.

`eas.json` already has the API key ID and issuer ID filled in. Two fields
still say `REPLACE_WITH_...` and need real values before this works:

- `appleTeamId` — developer.apple.com → Account → Membership
- `ascAppId` — App Store Connect → Vesper: Life After Six. → App Information
  → "Apple ID" (a numeric ID, not the bundle ID)

## Authenticate the EAS CLI

```bash
eas login
```

This is your Expo account (expo.dev), separate from Apple. If you don't
have one, `eas login` will offer to create one.

## Build

```bash
eas build --platform ios --profile production --non-interactive
```

First run: EAS will use the App Store Connect API key to generate a
distribution certificate and provisioning profile automatically — no
interactive Apple prompts expected. Takes 10-20 minutes; EAS emails you
when it's done, or watch it at the URL the command prints.

## Submit to TestFlight

```bash
eas submit --platform ios --latest --non-interactive
```

This uploads the build to App Store Connect and attaches it to the
existing "Vesper: Life After Six." listing (matched by `ascAppId`), not a
new one. TestFlight processing (Apple's automated scan, not full app
review) usually takes 10-30 minutes. Once it clears, install the
**TestFlight** app on your phone, and the build will be available to add
as an internal tester under App Store Connect → Vesper → TestFlight →
Internal Testing.
