-- Create app_users table for simple email-only authentication
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.app_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - Optional but recommended
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access (since we are handling auth manually in the backend)
-- Or, if we want to restricted, we can just allow the service role (backend) to access it.
-- For this simple "no auth" auth, we might just leave RLS off or open.
-- Let's create a policy that allows all operations for now, as the backend will handle logic.
CREATE POLICY "Allow public access to app_users" ON public.app_users
FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_app_users_email ON public.app_users(email);
