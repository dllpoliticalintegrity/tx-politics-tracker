-- Per-poll table (one row per candidate per poll) used by the 270toWin importer.
CREATE TABLE IF NOT EXISTS public.race_polls (
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

CREATE UNIQUE INDEX IF NOT EXISTS race_polls_unique
  ON public.race_polls (race_id, pollster, field_end, candidate_name, source, matchup);

CREATE INDEX IF NOT EXISTS idx_race_polls_race_source
  ON public.race_polls (race_id, source);

CREATE INDEX IF NOT EXISTS idx_race_polls_matchup
  ON public.race_polls (race_id, source, matchup);

ALTER TABLE public.race_polls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view race polls" ON public.race_polls;
CREATE POLICY "Anyone can view race polls"
  ON public.race_polls FOR SELECT USING (true);

ALTER TABLE public.race_polling
  ADD COLUMN IF NOT EXISTS source     TEXT NOT NULL DEFAULT 'rcp',
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS poll_count INTEGER,
  ADD COLUMN IF NOT EXISTS as_of      DATE;

ALTER TABLE public.race_polling ALTER COLUMN rcp_url DROP NOT NULL;

DROP INDEX IF EXISTS public.idx_race_polling_race_id;
CREATE UNIQUE INDEX IF NOT EXISTS race_polling_race_source_unique
  ON public.race_polling (race_id, source);
