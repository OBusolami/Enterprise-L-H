-- 1. Add the status column with a default value of 'active'
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- 2. Update existing rows to 'active' if they are NULL
UPDATE public.resources 
SET status = 'active' 
WHERE status IS NULL;

-- 3. (Optional) Enforce the column to be NOT NULL
ALTER TABLE public.resources 
ALTER COLUMN status SET NOT NULL;
