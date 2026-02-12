-- 1. DELETE ALL OLD DATA
-- This will wipe everything so you can start fresh.
TRUNCATE public.resources CASCADE;
TRUNCATE public.teams CASCADE;
TRUNCATE public.app_users CASCADE;

-- 2. DISABLE RLS (Row Level Security)
-- Since we are now an anonymous app, we want Supabase to allow 
-- our backend to read/write without needing a logged-in user.
ALTER TABLE public.resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users DISABLE ROW LEVEL SECURITY;

-- 3. ENSURE PERMISSIONS
-- Grant all permissions to the 'anon' role so the frontend/backend can work.
GRANT ALL ON TABLE public.resources TO anon;
GRANT ALL ON TABLE public.teams TO anon;

-- 4. CLEAN UP FOREIGN KEYS (Optional but good for anonymity)
ALTER TABLE public.resources ALTER COLUMN submitter_id DROP NOT NULL;
ALTER TABLE public.resources ALTER COLUMN team_id DROP NOT NULL;
