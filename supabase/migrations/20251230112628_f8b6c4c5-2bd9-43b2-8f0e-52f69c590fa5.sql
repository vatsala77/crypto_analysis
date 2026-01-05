-- Create watchlist table for saving user's favorite coins
CREATE TABLE public.watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  coin_id TEXT NOT NULL,
  coin_name TEXT NOT NULL,
  coin_symbol TEXT NOT NULL,
  coin_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, coin_id)
);

-- Enable Row Level Security
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- Users can view their own watchlist items
CREATE POLICY "Users can view their own watchlist"
ON public.watchlist
FOR SELECT
USING (auth.uid() = user_id);

-- Users can add coins to their own watchlist
CREATE POLICY "Users can add to their own watchlist"
ON public.watchlist
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can remove coins from their own watchlist
CREATE POLICY "Users can delete from their own watchlist"
ON public.watchlist
FOR DELETE
USING (auth.uid() = user_id);