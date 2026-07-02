-- Remove contributions-made and refunds wrongly counted as independent
-- expenditures on the Form 460 Schedule E path.
--
-- A primarily-formed IE PAC's Form 460 Schedule E mixes its genuine independent
-- expenditures with (a) contributions it MADE to other committees (EXPN_CODE
-- CTB/MON/IKD) and (b) refunds of contributions it received. The importer
-- counted all of them as IE for/against the candidate, so the per-candidate IE
-- total was inflated and, worse, double-counted: e.g. "Californians for
-- Resilient and Affordable Energy, NO ON STEYER" transferred $8M to another
-- anti-Steyer PAC ("California Is Not for Sale") that ALSO reports its own ad
-- spending against Steyer — the same dollars counted twice. Refunds (money
-- returned) aren't spending at all.
--
-- We keep the per-candidate total on the spending side but count only money
-- actually spent for/against the candidate: genuine independent expenditures
-- (EXPN_CODE='IND'), agent-routed media ("SEE SCHEDULE G"/blank) and operating
-- outlays stay; contributions-made and refunds are removed. Verified against
-- the raw EXPN_CD: this drops ~$13.69M of CTB transfers + ~$3.42M of refunds.
--
-- import_ca_finance.py is updated in the same change to exclude these rows on
-- the F460 path going forward. EXPN_CODE isn't stored on rows loaded before
-- this change, so the CTB transfers are removed by their (filing_id, tran_id)
-- identified from the raw dump; refunds are removed by their stored description.

-- (a) Refunds — money returned, not spending. Description is stored, so match it
-- (covers "Refund" and "Partial Refund of Contribution").
delete from public.ca_independent_expenditures
where source_form_type = 'F460'
  and description ~* 'refund';

-- (b) Contributions MADE to other committees (EXPN_CODE CTB/MON/IKD). Enumerated
-- by (filing_id, tran_id) — catches every amendment of each transaction.
delete from public.ca_independent_expenditures
where source_form_type = 'F460'
  and (filing_id, tran_id) in (
    (3125939, 'EXP10'),
    (3138929, '500004245'),
    (3137638, 'EXP3'),
    (3156079, 'EXP8'),
    (3156079, 'EXP12'),
    (3156079, 'EXP17'),
    (3156079, 'EXP16'),
    (3156079, 'EXP18'),
    (3155176, 'EXP1')
  );

-- Refresh the latest-amendment flags and the IE rollups so the per-candidate
-- totals reflect the removal immediately.
select public.recompute_ca_latest_flags();
refresh materialized view public.ca_ie_by_candidate;
refresh materialized view public.ca_top_ie_donors;
