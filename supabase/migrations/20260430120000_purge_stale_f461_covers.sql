-- Delete stale F461 cover rows in ca_filings that were inserted by an earlier
-- version of import_ca_finance.py before F461 IE detection was rewritten to
-- per-row scanning of EXPN_CD Schedule E.
--
-- The earlier code path tried to match F461 IE filings via CAND_NAML on the
-- CVR cover row, but Form 461 covers don't carry candidate names — they
-- identify only the IE committee. Those rows landed in ca_filings with
-- cand_filer_id IS NULL and never produced any ca_independent_expenditures
-- records. (Many of the filers turn out to be major-donor Form 461s, not IE
-- committees — individuals reporting >$10K in personal contributions.)
--
-- Discriminator: F461 cover rows with no associated IE expenditure. After the
-- next sync runs the rewritten Stage 4b, every legitimate F461 cover will
-- have at least one matched ca_independent_expenditures row, so this
-- predicate only catches orphans.

delete from public.ca_filings f
  where f.form_type = 'F461'
    and not exists (
      select 1
      from public.ca_independent_expenditures ie
      where ie.filing_id = f.filing_id
    );
