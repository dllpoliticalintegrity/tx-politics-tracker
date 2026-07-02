
-- Create primary_predictions table
-- Users pick one winner per party (D and R) per race
CREATE TABLE public.primary_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  race_id UUID NOT NULL REFERENCES public.races(race_id) ON DELETE CASCADE,
  party TEXT NOT NULL,  -- 'D' or 'R'
  predicted_candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  is_correct BOOLEAN,  -- NULL until scored, TRUE/FALSE after primary
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, race_id, party)
);

-- Enable RLS
ALTER TABLE public.primary_predictions ENABLE ROW LEVEL SECURITY;

-- Users can view all primary predictions (for community consensus)
CREATE POLICY "Anyone can view primary predictions"
  ON public.primary_predictions FOR SELECT
  USING (true);

-- Users can insert their own predictions
CREATE POLICY "Users can insert own primary predictions"
  ON public.primary_predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own predictions
CREATE POLICY "Users can update own primary predictions"
  ON public.primary_predictions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own predictions
CREATE POLICY "Users can delete own primary predictions"
  ON public.primary_predictions FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_primary_predictions_race ON public.primary_predictions(race_id);
CREATE INDEX idx_primary_predictions_user ON public.primary_predictions(user_id);
