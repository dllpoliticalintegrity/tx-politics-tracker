-- Derived donor views, ported from the CA repo (20260421180020_tighten_ca_top_donors_grouping,
-- 20260423220000_materialize_ca_top_ie_donors, 20260501*/20260504* dedup chain).
--
-- Much of the CA complexity existed because CAL-ACCESS amendments and F497/F460
-- overlaps had to be deduplicated in SQL. TEC marks superseded reports with
-- infoOnlyFlag='Y' and the importer skips them, so "deduped" collapses to a
-- simple relation here:
--   tx_contributions_deduped = itemized contributions + loans (Schedule E),
--   with loans exposed as source_form_type='B-LOAN' so the frontend's
--   loans/self-funding split (source_form_type LIKE 'B%') keeps working.

CREATE VIEW public.tx_contributions_deduped AS
SELECT
  c.id,
  c.candidate_id,
  c.filer_ident,
  c.contributor_type,
  c.contributor_last_name,
  c.contributor_first_name,
  c.employer,
  c.occupation,
  c.amount,
  c.contribution_date,
  c.city,
  c.state,
  c.zip,
  c.cycle,
  c.source_form_type
FROM public.tx_contributions c
UNION ALL
SELECT
  l.id,
  l.candidate_id,
  l.filer_ident,
  l.lender_type      AS contributor_type,
  l.lender_last_name AS contributor_last_name,
  l.lender_first_name AS contributor_first_name,
  NULL               AS employer,
  NULL               AS occupation,
  l.amount,
  l.loan_date        AS contribution_date,
  NULL               AS city,
  NULL               AS state,
  NULL               AS zip,
  l.cycle,
  'B-LOAN'           AS source_form_type
FROM public.tx_loans l
WHERE NOT l.is_guarantor;

GRANT SELECT ON public.tx_contributions_deduped TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Top donors per candidate: group by candidate + strictly normalized full
-- name (same grouping the CA view settled on so family members with
-- different first names stay separate; ENTITY donors carry their whole name
-- in contributor_last_name and group on it alone).
-- ---------------------------------------------------------------------------
CREATE VIEW public.tx_top_donors AS
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
  FROM public.tx_contributions_deduped
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

GRANT SELECT ON public.tx_top_donors TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Top donors into DCE/SPAC committees (who funds the PACs). Materialized for
-- the same reason ca_top_ie_donors was: the aggregate can outgrow the anon
-- statement timeout as tx_ie_contributions grows.
-- ---------------------------------------------------------------------------
CREATE MATERIALIZED VIEW public.tx_top_ie_donors AS
WITH normalized AS (
  SELECT
    ie_filer_ident,
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
  FROM public.tx_ie_contributions
)
SELECT
  ie_filer_ident,
  COALESCE(norm_last, '')  AS norm_last_key,
  COALESCE(norm_first, '') AS norm_first_key,
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
  ie_filer_ident,
  COALESCE(norm_last,  ''),
  COALESCE(norm_first, '');

-- Required for REFRESH MATERIALIZED VIEW CONCURRENTLY.
CREATE UNIQUE INDEX tx_top_ie_donors_pk
  ON public.tx_top_ie_donors (ie_filer_ident, norm_last_key, norm_first_key);

-- Supports the frontend's "order by total_amount desc limit 10000" query.
CREATE INDEX tx_top_ie_donors_total_amount_idx
  ON public.tx_top_ie_donors (total_amount DESC);

GRANT SELECT ON public.tx_top_ie_donors TO anon, authenticated, service_role;

-- Extend the refresh helper so one call refreshes everything after an import.
CREATE OR REPLACE FUNCTION public.refresh_tx_finance_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET statement_timeout = '10min'
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.tx_contributions_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.tx_ie_by_candidate;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.tx_top_ie_donors;
END;
$$;

GRANT EXECUTE ON FUNCTION public.refresh_tx_finance_views() TO service_role;
