
# Singles Meal

**Eat Better. Track Smarter. Live Healthier.**

A bilingual (English/Bangla) health-focused meal ordering and catering platform starter:
- `apps/web`: responsive customer website + admin/kitchen dashboard (Next.js)
- `apps/mobile`: Expo React Native customer app
- `supabase/schema.sql`: PostgreSQL schema, RLS policies, starter catalog
- `packages/shared`: shared types and nutrition utilities

## Prerequisites
- Node.js 20+
- pnpm 9+
- A Supabase project (or local Supabase CLI)
- Expo Go for mobile preview

## Quick start
```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
# Fill in Supabase URL and anon key in both files.
pnpm dev:web
```
Open http://localhost:3000.

For the mobile app:
```bash
pnpm dev:mobile
```
Scan the QR code with Expo Go. Configure `EXPO_PUBLIC_SUPABASE_URL` and
`EXPO_PUBLIC_SUPABASE_ANON_KEY` in `apps/mobile/.env`.

## Database setup
1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. In Supabase Authentication, enable email and phone OTP providers as desired.
5. Add your first admin user, then set their profile role to `admin` using the SQL editor:
```sql
update public.profiles set role = 'admin' where id = 'AUTH_USER_UUID';
```

## Useful scripts
```bash
pnpm dev:web       # customer website + admin routes
pnpm dev:mobile    # Expo app
pnpm build:web
pnpm lint
```

## Important implementation notes
- The UI includes demo meal data so the app can be explored before credentials are configured.
- Supabase-backed reads/writes activate when environment variables are present.
- The checkout intentionally creates an order in `pending_payment` state. Do not mark an order paid from the client. Connect a verified payment-provider webhook (bKash/Nagad/SSLCommerz) before production.
- Nutrition values are estimates calculated from verified recipe ingredients and serving sizes. Have a qualified nutrition professional review recipes and claims.
- Allergy exclusions should be treated as hard filters. Never rely on an AI model as the sole allergy-safety control.
- Health metrics are sensitive personal data. Obtain informed consent, minimize collection, enforce RLS, and publish a privacy policy before launch.
- This is a development starter, not a certified medical device or a substitute for clinical advice.

## Production checklist
- [ ] Configure Supabase Auth, email/SMS templates and redirect URLs
- [ ] Review every RLS policy with test users and role scenarios
- [ ] Add payment-provider server integration and signed webhook verification
- [ ] Add delivery-provider / rider workflow and live location only with consent
- [ ] Add kitchen cutoff times, stock reservation and idempotent order handling
- [ ] Add image storage, backups, monitoring, rate limits and audit logs
- [ ] Add Bangla translations reviewed by a native speaker
- [ ] Complete food safety, allergen, labeling and local regulatory review
- [ ] Add privacy policy, terms, refund policy and data deletion workflow
- [ ] Run accessibility, security, load and end-to-end tests

## Project structure
```text
apps/
  web/
    app/                 Next.js App Router pages and API routes
    components/          Reusable UI
    lib/                 Supabase, translations, demo data
  mobile/                Expo React Native app
packages/
  shared/                Types and nutrition helpers
supabase/
  schema.sql
```
