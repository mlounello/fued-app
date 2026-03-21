# Supabase Rollout

This project uses a shared production Supabase environment, so migration rollout should stay conservative and app-isolated.

## Environment

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Migration order

Apply the files in `/supabase/migrations` in timestamp order:

1. `20260321_001_create_app_schemas.sql`
2. `20260321_002_create_extensions_and_enums.sql`
3. `20260321_003_create_base_functions.sql`
4. `20260321_004_create_profiles.sql`
5. `20260321_005_create_games_and_content_tables.sql`
6. `20260321_006_create_sessions_tables.sql`
7. `20260321_007_create_assets_table.sql`
8. `20260321_008_create_rls_helper_functions.sql`
9. `20260321_009_enable_rls.sql`
10. `20260321_010_create_rls_policies.sql`
11. `20260321_011_create_gameplay_functions.sql`
12. `20260321_012_create_admin_functions.sql`
13. `20260321_013_create_display_payload_function.sql`
14. Create the `fued-game-assets` bucket
15. `20260321_014_storage_policies.sql`
16. `20260321_015_grants.sql`

## Before applying migrations

- Confirm the target project is the intended shared production Supabase project.
- Review each migration manually.
- Create the `fued-game-assets` bucket before the storage policy step.
- Add `fued_public` to the project exposed schemas.
- Add this app's auth callback URL to allowed redirect URLs.
- Do not apply ad hoc schema edits from the dashboard unless there is an emergency.

## After applying migrations

- Sign in with the first real operator account so a `profiles` row is created.
- Promote the first admin manually:

```sql
update fued_public.profiles
set is_admin = true
where email = 'your-email@example.com';
```

- Validate that the public display function is callable and that operator routes can read their own rows through RLS.

## Auth profile sync expectation

The app creates or refreshes the `fued_public.profiles` row during auth flows. No `auth.users` trigger is used.
