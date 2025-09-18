-- Fix RLS policies for issue creation
-- Run this in Supabase SQL Editor

-- 1. Check if civic_issues table exists and has proper structure
CREATE TABLE IF NOT EXISTS public.civic_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'submitted',
    
    -- Location information
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- User information
    reporter_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    assigned_department_id UUID,
    assigned_to UUID,
    
    -- Contact information (for anonymous reporting)
    reporter_name TEXT,
    reporter_email TEXT,
    reporter_phone TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_reporter CHECK (
        reporter_id IS NOT NULL OR 
        (reporter_name IS NOT NULL AND reporter_email IS NOT NULL)
    )
);

-- 2. Enable RLS
ALTER TABLE public.civic_issues ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "public_can_read_issues" ON public.civic_issues;
DROP POLICY IF EXISTS "authenticated_can_create_issues" ON public.civic_issues;
DROP POLICY IF EXISTS "users_can_create_issues" ON public.civic_issues;
DROP POLICY IF EXISTS "admins_can_manage_issues" ON public.civic_issues;
DROP POLICY IF EXISTS "service_role_can_manage_issues" ON public.civic_issues;

-- 4. Create comprehensive RLS policies

-- Allow public to read all issues (for transparency)
CREATE POLICY "public_can_read_issues"
ON public.civic_issues
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to create issues
CREATE POLICY "authenticated_can_create_issues"
ON public.civic_issues
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to update their own issues
CREATE POLICY "users_can_update_own_issues"
ON public.civic_issues
FOR UPDATE
TO authenticated
USING (reporter_id = auth.uid())
WITH CHECK (reporter_id = auth.uid());

-- Allow admins to manage all issues
CREATE POLICY "admins_can_manage_issues"
ON public.civic_issues
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'department_manager')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'department_manager')
    )
);

-- Allow service role to manage all issues (for triggers and functions)
CREATE POLICY "service_role_can_manage_issues"
ON public.civic_issues
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON public.civic_issues TO authenticated, service_role;
GRANT SELECT ON public.civic_issues TO anon;

-- 6. Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES public.civic_issues(id) ON DELETE CASCADE,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('user', 'admin', 'department')),
    recipient_phone TEXT NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('whatsapp', 'sms', 'failed')),
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'delivered', 'read')),
    message_content TEXT NOT NULL,
    error_message TEXT,
    external_id TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
DROP POLICY IF EXISTS "admins_can_read_notifications" ON public.notifications;
DROP POLICY IF EXISTS "system_can_insert_notifications" ON public.notifications;

CREATE POLICY "admins_can_read_notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'department_manager')
    )
);

CREATE POLICY "system_can_insert_notifications"
ON public.notifications
FOR INSERT
TO authenticated, service_role
WITH CHECK (true);

-- Grant permissions for notifications
GRANT ALL ON public.notifications TO authenticated, service_role;

-- 7. Test the setup
SELECT 
  'RLS Policies Check' as test_type,
  schemaname,
  tablename,
  policyname,
  'EXISTS' as status
FROM pg_policies 
WHERE tablename IN ('civic_issues', 'notifications', 'user_profiles')
ORDER BY tablename, policyname;