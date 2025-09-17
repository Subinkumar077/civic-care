# Fix Login Issue - Database Migration Required

## Problem
The login is failing because the database tables don't exist yet. The migration file exists but hasn't been applied to your Supabase database.

## Solution: Apply the Migration

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: `vcarstdwndpixwqxmruu`
3. Make sure your project is not paused (if it shows "Paused", click "Resume")

### Step 2: Run the Migration
1. Click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire content from `supabase/migrations/20250117032656_civic_platform_complete.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the migration

### Step 3: Verify Demo Users
After running the migration, these demo accounts will be created:
- **Admin**: `admin@civic.gov` / `admin123`
- **Citizen**: `citizen@example.com` / `citizen123`

### Step 4: Test Login
Return to your app and try logging in with either demo account.

## Alternative: Use Supabase CLI (if installed)
If you have Supabase CLI installed:
```bash
supabase db reset
```

## Verification
Run this test to verify everything works:
```bash
node test-supabase.js
```

The test should show:
- ✅ Supabase connection successful
- ✅ Demo login successful