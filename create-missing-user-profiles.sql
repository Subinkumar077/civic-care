-- Create user profiles for existing users who don't have them
-- Run this in Supabase SQL Editor after running fix-user-registration.sql

-- Insert profiles for users who don't have them yet
INSERT INTO public.user_profiles (id, email, full_name, role, phone, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)) as full_name,
  COALESCE(au.raw_user_meta_data->>'role', 'citizen')::public.user_role as role,
  au.raw_user_meta_data->>'phone' as phone,
  au.created_at
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL
  AND au.email IS NOT NULL;

-- Check the results
SELECT 
  'Total auth users' as description,
  COUNT(*) as count
FROM auth.users
WHERE email IS NOT NULL

UNION ALL

SELECT 
  'Users with profiles' as description,
  COUNT(*) as count
FROM public.user_profiles

UNION ALL

SELECT 
  'Missing profiles' as description,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL
  AND au.email IS NOT NULL;