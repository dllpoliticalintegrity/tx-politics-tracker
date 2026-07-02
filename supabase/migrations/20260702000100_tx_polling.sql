-- Polling tables, ported unchanged from the CA repo's
-- 20260411222629 (race_polling) + 20260426032941 (race_polls) migrations,
-- plus the Texas governor race seed.

-- Aggregated polling snapshot (one row per race per source).
CREATE TABLE public.race_polling (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  race_id UUID REFERENCES public.races(race_id) ON DELETE CASCADE NOT NULL,
  rcp_url TEXT,
  candidate_a_name TEXT,
  candidate_a_party TEXT,
  candidate_a_pct NUMERIC,
  candidate_b_name TEXT,
  candidate_b_party TEXT,
  candidate_b_pct NUMERIC,
  spread TEXT,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'rcp',
  source_url TEXT,
  poll_count INTEGER,
  as_of DATE
);

CREATE UNIQUE INDEX race_polling_race_source_unique
  ON public.race_polling (race_id, source);

ALTER TABLE public.race_polling ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view polling data"
  ON public.race_polling FOR SELECT USING (true);

-- Per-poll table (one row per candidate per poll) used by the 270toWin importer.
CREATE TABLE public.race_polls (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  race_id         UUID NOT NULL REFERENCES public.races(race_id) ON DELETE CASCADE,
  candidate_name  TEXT NOT NULL,
  candidate_party TEXT,
  pct             NUMERIC NOT NULL,
  pollster        TEXT NOT NULL,
  field_start     DATE,
  field_end       DATE NOT NULL,
  sample_size     INTEGER,
  sample_kind     TEXT,
  source          TEXT NOT NULL DEFAULT '270towin',
  source_url      TEXT,
  matchup         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX race_polls_unique
  ON public.race_polls (race_id, pollster, field_end, candidate_name, source, matchup);

CREATE INDEX idx_race_polls_race_source
  ON public.race_polls (race_id, source);

CREATE INDEX idx_race_polls_matchup
  ON public.race_polls (race_id, source, matchup);

ALTER TABLE public.race_polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view race polls"
  ON public.race_polls FOR SELECT USING (true);

-- The race this site tracks.
INSERT INTO races (state, district, slug, year, featured)
VALUES ('Texas', 'Governor', 'texas-governor-2026', 2026, true)
ON CONFLICT DO NOTHING;
