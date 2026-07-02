-- Restrict F497-vs-F460 dedup to self-funding only.
--
-- Power Search treats external donor F497 entries as separate from F460
-- Schedule A entries even when they share (donor, date, amount). The
-- justification: at the FPPC max-out limit ($39,200 per election), "two
-- contributions on the same day with the same amount" is plausibly a
-- legitimate primary + general split rather than a dedup artifact, so
-- Power Search counts them separately.
--
-- For self-funding (candidate giving to their own committee), the same
-- chunk is genuinely re-reported on F497 (late) and the next quarterly
-- F460. Steyer's $11M+ self-funding chunks are clearly not max-out
-- duplicates — they're the same dollars reported twice. Power Search
-- dedupes those.
--
-- Concrete impact at the time of this migration:
--   Steyer  $147.25M → $147.40M   (no change — self-funding still dedupes)
--   Mahan   $14.80M  → $27.03M    (+$12M of external F497 no longer dropped)
--   Swalwell $8.54M  → $15.12M    (+$6.6M)
--   Porter   $6.15M  → $8.45M     (matches Power Search's $8.59M)
--   Becerra  $6.50M  → $8.38M
--   Villaraigosa $4.14M → $7.48M
--   Bianco   $4.75M  → $6.88M
--   Hilton   $8.29M  → $12.11M
--
-- Self-funding heuristic: contributor's last name appears in the
-- candidate's full name. False positives possible for namesakes (e.g.,
-- a "Hilton" donor unrelated to Steve Hilton) but in practice these are
-- rare and require both same name AND identical (date, amount) to F460
-- to actually trigger dedup.

drop materialized view if exists public.ca_contributions_summary;
drop view if exists public.ca_top_donors;
drop view if exists public.ca_contributions_deduped;

create view public.ca_contributions_deduped as
with max_amend as (
  select
    filing_id,
    max(amend_id) as max_amend_id
  from public.ca_contributions
  where candidate_id is not null
  group by filing_id
),
amend_filtered as (
  select c.*
  from public.ca_contributions c
  join max_amend m
    on m.filing_id = c.filing_id
   and m.max_amend_id = c.amend_id
  where c.candidate_id is not null
),
flagged as (
  select
    a.*,
    bool_or(upper(coalesce(a.source_form_type, '')) in ('A','C','I')) over (
      partition by
        a.candidate_id,
        upper(coalesce(a.contributor_last_name,  '')),
        upper(coalesce(a.contributor_first_name, '')),
        a.contribution_date,
        a.amount
    ) as has_f460_twin,
    case
      when upper(coalesce(a.contributor_last_name, '')) <> ''
       and upper(cand.name) like '%' || upper(a.contributor_last_name) || '%'
      then true
      else false
    end as is_self_funding
  from amend_filtered a
  join public.ca_candidates cand on cand.id = a.candidate_id
)
select
  id, candidate_id, committee_filer_id, filing_id, amend_id, tran_id,
  contributor_type, contributor_last_name, contributor_first_name,
  employer, occupation, amount, contribution_date,
  cumulative_ytd, city, state, zip, cycle, source_form_type
from flagged
where
  upper(coalesce(source_form_type, '')) in ('A','C','I')
  or not (has_f460_twin and is_self_funding);

grant select on public.ca_contributions_deduped to anon, authenticated, service_role;

create view public.ca_top_donors as
with normalized as (
  select
    candidate_id,
    contributor_type,
    nullif(
      regexp_replace(
        regexp_replace(upper(btrim(contributor_last_name)), '[^A-Z0-9 ]', '', 'g'),
        '\s+', ' ', 'g'
      ), ''
    ) as norm_last,
    nullif(
      regexp_replace(
        regexp_replace(upper(btrim(contributor_first_name)), '[^A-Z0-9 ]', '', 'g'),
        '\s+', ' ', 'g'
      ), ''
    ) as norm_first,
    contributor_last_name,
    contributor_first_name,
    employer,
    occupation,
    city,
    state,
    amount,
    contribution_date
  from public.ca_contributions_deduped
  where candidate_id is not null
)
select
  candidate_id,
  (array_agg(contributor_last_name  order by contribution_date desc nulls last))[1] as contributor_last_name,
  (array_agg(contributor_first_name order by contribution_date desc nulls last))[1] as contributor_first_name,
  (array_agg(contributor_type       order by contribution_date desc nulls last))[1] as contributor_type,
  (array_agg(employer               order by contribution_date desc nulls last))[1] as employer,
  (array_agg(occupation             order by contribution_date desc nulls last))[1] as occupation,
  (array_agg(city                   order by contribution_date desc nulls last))[1] as city,
  (array_agg(state                  order by contribution_date desc nulls last))[1] as state,
  count(*)::bigint                  as contribution_count,
  coalesce(sum(amount), 0)::numeric as total_amount,
  max(contribution_date)            as last_contribution_date
from normalized
group by
  candidate_id,
  norm_last,
  coalesce(norm_first, '');

grant select on public.ca_top_donors to anon, authenticated, service_role;

create materialized view public.ca_contributions_summary as
select
  c.id as candidate_id,
  c.slug,
  c.name,
  c.committee_filer_id,
  coalesce(x.cycle, 'unknown') as cycle,
  count(*)            filter (where x.contributor_type in ('IND','OTH'))                    as individual_donor_count,
  sum(x.amount)       filter (where x.contributor_type in ('IND','OTH'))                    as individual_contributions,
  sum(x.amount)       filter (where x.contributor_type in ('COM','SCC'))                    as pac_contributions,
  sum(x.amount)       filter (where x.contributor_type = 'PTY')                              as party_contributions,
  sum(x.amount)       filter (where x.contributor_type in ('IND','OTH') and x.amount < 200) as small_dollar_contributions,
  count(*)            filter (where x.contributor_type in ('IND','OTH') and x.amount < 200) as small_dollar_count,
  sum(x.amount)                                                                              as total_raised,
  max(x.contribution_date)                                                                   as as_of
from public.ca_candidates c
left join public.ca_contributions_deduped x on x.candidate_id = c.id
group by c.id, c.slug, c.name, c.committee_filer_id, x.cycle;

create unique index ca_contributions_summary_pk
  on public.ca_contributions_summary (candidate_id, cycle);

create index ca_contributions_summary_slug_idx
  on public.ca_contributions_summary (slug);

grant select on public.ca_contributions_summary to anon, authenticated;
