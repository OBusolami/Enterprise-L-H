-- 1. DELETE ALL OLD DATA
-- This wipes your existing teams and resources so you can start fresh.
TRUNCATE public.resources CASCADE;
TRUNCATE public.teams CASCADE;

-- 2. DISABLE RLS (Row Level Security)
-- This allows the app to work without a "Login" system.
ALTER TABLE public.resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams DISABLE ROW LEVEL SECURITY;

-- 3. GRANT PERMISSIONS
-- Ensures the anonymous role can read/write data.
GRANT ALL ON TABLE public.resources TO anon;
GRANT ALL ON TABLE public.teams TO anon;
GRANT ALL ON TABLE public.resources TO authenticated; -- Just in case
GRANT ALL ON TABLE public.teams TO authenticated;
