-- Fix RLS Policies - Remove direct auth.users access
-- Run this in Supabase SQL Editor to fix the permission issues

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "public_can_read_departments" ON public.departments;
DROP POLICY IF EXISTS "admins_manage_departments" ON public.departments;
DROP POLICY IF EXISTS "public_can_read_civic_issues" ON public.civic_issues;
DROP POLICY IF EXISTS "authenticated_users_create_issues" ON public.civic_issues;
DROP POLICY IF EXISTS "reporters_update_own_issues" ON public.civic_issues;
DROP POLICY IF EXISTS "admins_manage_all_issues" ON public.civic_issues;

-- Recreate all policies with correct references

-- Departments policies
CREATE POLICY "public_can_read_departments"
ON public.departments
FOR SELECT
TO public
USING (true);

CREATE POLICY "admins_manage_departments"
ON public.departments
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role = 'admin'
    )
);

-- Civic issues policies
CREATE POLICY "public_can_read_civic_issues"
ON public.civic_issues
FOR SELECT
TO public
USING (true);

CREATE POLICY "authenticated_users_create_issues"
ON public.civic_issues
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "reporters_update_own_issues"
ON public.civic_issues
FOR UPDATE
TO authenticated
USING (reporter_id = auth.uid())
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "admins_manage_all_issues"
ON public.civic_issues
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role = 'admin'
    )
);