# Fix Reports Listing Error

## Problem
After submitting a report, users are redirected to the Public Reports page but see "Error Loading Reports" with "TypeError: Failed to fetch".

## Root Cause
The issue is likely caused by:
1. **RLS Policies**: Blocking public read access to civic_issues table
2. **Missing Tables**: Related tables (departments, etc.) don't exist
3. **Complex Joins**: Query trying to join non-existent tables

## IMMEDIATE FIX

### Step 1: Fix RLS Policies (CRITICAL)
1. **Open Supabase Dashboard → SQL Editor**
2. **Copy and paste ALL content from `fix-reports-listing-rls.sql`**
3. **Click "Run"**
4. **Verify you see policies listed at the end**

### Step 2: Test the Fix
1. **Open browser console**
2. **Run the test script:**
   ```javascript
   // Copy and paste content from test-reports-listing.js
   ```

### Step 3: Verify in UI
1. **Go to Public Reports page**
2. **Should now show issues instead of error**
3. **Check browser console for detailed logs**

## What I Fixed

### ✅ Enhanced getIssues Function:
- **Simplified Query**: Removed complex joins that might fail
- **Graceful Degradation**: Falls back to basic data if related tables don't exist
- **Better Error Handling**: Non-blocking enhancement of issue data
- **Detailed Logging**: Console logs for debugging

### ✅ RLS Policy Fix:
- **Public Read Access**: Allows anonymous users to read issues
- **Related Tables**: Fixes policies for images, votes, updates
- **Proper Permissions**: Grants necessary SELECT permissions

### ✅ Robust Data Fetching:
- **Basic Query First**: Gets core issue data reliably
- **Enhancement Layer**: Adds related data without breaking if tables don't exist
- **Fallback Values**: Provides default values if enhancement fails

## Expected Results

### ✅ Reports Listing Should Show:
- List of submitted issues
- Issue titles, descriptions, locations
- Status and priority indicators
- Vote counts and image counts
- Proper pagination and filtering

### ✅ Console Logs Should Show:
```
🔍 Fetching issues with filters: {}
📊 Executing basic issues query...
✅ Basic issues fetched: 5
✅ Issues enhanced successfully
```

## Troubleshooting

### Still Getting "Failed to fetch":
1. **Check Supabase Project**: Ensure it's not paused
2. **Run RLS Fix**: Execute `fix-reports-listing-rls.sql`
3. **Check Network**: Look for network connectivity issues

### "Permission denied" Error:
1. **RLS Blocking Access**: Run the RLS fix script
2. **Check Policies**: Ensure public read policies exist
3. **Verify Permissions**: Check GRANT statements executed

### Empty Results:
1. **No Issues Created**: Submit a test issue first
2. **Filters Applied**: Check if filters are hiding results
3. **Data Enhancement Failed**: Check console for warnings

## Debug Tools

### 1. Quick Test:
```javascript
// Run in console to test basic functionality
// Copy content from test-reports-listing.js
```

### 2. Manual Query Test:
```javascript
// Test direct Supabase query
const { supabase } = await import('./src/lib/supabase.js');
const { data, error } = await supabase.from('civic_issues').select('*').limit(5);
console.log({ data, error });
```

### 3. Check RLS Policies:
```sql
-- Run in Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'civic_issues';
```

## Files Updated:
- ✅ `src/services/civicIssueService.js` - Enhanced getIssues function
- ✅ `fix-reports-listing-rls.sql` - RLS policy fixes
- ✅ `test-reports-listing.js` - Debug script

## Priority Actions:
1. **RUN `fix-reports-listing-rls.sql`** ← Most important
2. **Test with debug script**
3. **Check reports page in UI**
4. **Submit new issue to verify end-to-end flow**

The reports listing should work immediately after running the RLS fix!