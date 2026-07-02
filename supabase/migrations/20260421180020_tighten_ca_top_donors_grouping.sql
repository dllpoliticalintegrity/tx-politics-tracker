-- Tighten ca_top_donors so family members with different first names
-- are no longer collapsed into a single donor row.
--
-- Previous behavior was grouping by last name + a loose first-name key
-- (e.g. first initial / prefix), which merged e.g. "John Smith" and
-- "Jane Smith". We now group strictly by the FULL normalized first +
-- last name (uppercased, trimmed, internal whitespace collapsed,
-- punctuation stripped). PAC / committee donors (no first name) still
-- group by last_name only, since their full name lives in last_name.

DROP VIEW IF EXISTS public.ca_top_donors;

CREATE VIEW public.ca_top_donors AS
WITH normalized AS (
  SELECT
    candidate_id,
    contributor_type,
    NULLIF(
      regexp_replace(
        regexp_replace(upper(btrim(contributor_last_name)), '[^A-Z0-9 ]', '', 'g'),
        '\s+', ' ', 'g'
      ), ''
    ) AS norm_last,
    NULLIF(
      regexp_replace(
        regexp_replace(upper(btrim(contributor_first_name)), '[^A-Z0-9 ]', '', 'g'),
        '\s+', ' ', 'g'
      ), ''
    ) AS norm_first,
    contributor_last_name,
    contributor_first_name,
    employer,
    occupation,
    city,
    state,
    amount,
    contribution_date
  FROM public.ca_contributions_deduped
  WHERE candidate_id IS NOT NULL
)
SELECT
  candidate_id,
  (array_agg(contributor_last_name  ORDER BY contribution_date DESC NULLS LAST))[1] AS contributor_last_name,
  (array_agg(contributor_first_name ORDER BY contribution_date DESC NULLS LAST))[1] AS contributor_first_name,
  (array_agg(contributor_type       ORDER BY contribution_date DESC NULLS LAST))[1] AS contributor_type,
  (array_agg(employer               ORDER BY contribution_date DESC NULLS LAST))[1] AS employer,
  (array_agg(occupation             ORDER BY contribution_date DESC NULLS LAST))[1] AS occupation,
  (array_agg(city                   ORDER BY contribution_date DESC NULLS LAST))[1] AS city,
  (array_agg(state                  ORDER BY contribution_date DESC NULLS LAST))[1] AS state,
  COUNT(*)::bigint                  AS contribution_count,
  COALESCE(SUM(amount), 0)::numeric AS total_amount,
  MAX(contribution_date)            AS last_contribution_date
FROM normalized
GROUP BY
  candidate_id,
  norm_last,
  COALESCE(norm_first, '');

GRANT SELECT ON public.ca_top_donors TO anon, authenticated, service_role;
