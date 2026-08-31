-- Durable home for the FiftyPlusOne importer's unmatched-candidate worklist,
-- ported from integrityindex. Each row = a feed candidate we could not tie to
-- a filed candidate in tx_candidates. Real people here need a name fix / new
-- row in tx_candidates; minor-party names and FiftyPlusOne "what-if"
-- hypotheticals also land here and are expected. The importer truncates +
-- repopulates this every run, so it always reflects the latest import.
CREATE TABLE IF NOT EXISTS public.poll_import_unmatched (
  source        text        NOT NULL,
  race_key      text        NOT NULL,   -- "state|office" e.g. "texas|governor"
  candidate     text        NOT NULL,   -- feed's candidate name
  best_pct      numeric,                -- best poll showing (helps triage)
  seen_at       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (source, race_key, candidate)
);

COMMENT ON TABLE public.poll_import_unmatched IS
  'Worklist of poll-feed candidates that did not match a filed candidate. Repopulated each import run.';

ALTER TABLE public.poll_import_unmatched ENABLE ROW LEVEL SECURITY;

-- Replace-all helper so the importer can refresh the worklist in one call.
CREATE OR REPLACE FUNCTION public.replace_poll_import_unmatched(
  p_source text,
  p_rows   jsonb
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  n integer;
BEGIN
  DELETE FROM public.poll_import_unmatched WHERE source = p_source;
  INSERT INTO public.poll_import_unmatched (source, race_key, candidate, best_pct)
  SELECT p_source, rec->>'rk', rec->>'name', NULLIF(rec->>'pct','')::numeric
  FROM jsonb_array_elements(p_rows) rec;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END;
$function$;
