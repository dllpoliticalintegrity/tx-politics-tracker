
-- Create race_polling table
CREATE TABLE public.race_polling (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  race_id UUID REFERENCES public.races(race_id) ON DELETE CASCADE NOT NULL,
  rcp_url TEXT NOT NULL,
  candidate_a_name TEXT,
  candidate_a_party TEXT,
  candidate_a_pct NUMERIC,
  candidate_b_name TEXT,
  candidate_b_party TEXT,
  candidate_b_pct NUMERIC,
  spread TEXT,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint: one polling record per race
CREATE UNIQUE INDEX idx_race_polling_race_id ON public.race_polling(race_id);

-- Enable RLS
ALTER TABLE public.race_polling ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view polling data"
  ON public.race_polling
  FOR SELECT
  USING (true);

-- Add rcp_url column to races table
ALTER TABLE public.races ADD COLUMN IF NOT EXISTS rcp_url TEXT;
