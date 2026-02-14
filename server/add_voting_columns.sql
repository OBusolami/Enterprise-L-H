-- Add voting columns to public.resources
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS upvote_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvote_count INTEGER DEFAULT 0;
