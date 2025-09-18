-- Fix RLS policies for reports listing
-- Run this in Supabase SQL Editor

-- Ensure civic_issues table has proper RLS policies for public reading
ALTER TABLE public.civic_issues ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "public_can_read_issues" ON public.civic_issues;
DROP POLICY IF EXISTS "anonymous_can_read_issues" ON public.civic_issues;

-- Create policy to allow public (including anonymous) to read all issues
CREATE POLICY "public_can_read_issues"
ON public.civic_issues
FOR SELECT
TO public
USING (true);

-- Ensure other related tables also allow public reading
ALTER TABLE public.issue_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_can_read_issue_images" ON public.issue_images;
CREATE POLICY "public_can_read_issue_images"
ON public.issue_images
FOR SELECT
TO public
USING (true);

ALTER TABLE public.issue_votes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_can_read_issue_votes" ON public.issue_votes;
CREATE POLICY "public_can_read_issue_votes"
ON public.issue_votes
FOR SELECT
TO public
USING (true);

ALTER TABLE public.issue_updates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_can_read_issue_updates" ON public.issue_updates;
CREATE POLICY "public_can_read_issue_updates"
ON public.issue_updates
FOR SELECT
TO public
USING (is_public = true);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_can_read_user_profiles" ON public.user_profiles;
CREATE POLICY "public_can_read_user_profiles"
ON public.user_profiles
FOR SELECT
TO public
USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.civic_issues TO anon, authenticated;
GRANT SELECT ON public.issue_images TO anon, authenticated;
GRANT SELECT ON public.issue_votes TO anon, authenticated;
GRANT SELECT ON public.issue_updates TO anon, authenticated;
GRANT SELECT ON public.user_profiles TO anon, authenticated;

-- Test the policies
SELECT 
  'Policy Test' as test_type,
  schemaname,
  tablename,
  policyname,
  'EXISTS' as status
FROM pg_policies 
WHERE tablename IN ('civic_issues', 'issue_images', 'issue_votes', 'issue_updates', 'user_profiles')
  AND policyname LIKE '%public%'
ORDER BY tablename, policyname;