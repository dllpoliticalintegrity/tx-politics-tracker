-- FiftyPlusOne is the only polling source.
--
-- The RealClearPolitics (source = 'rcp') and 270toWin (source = '270towin')
-- importers inherited from the CA repo are retired: their edge functions and
-- scripts are deleted in the same change, the polling-sync workflow only ever
-- called import-fiftyplusone-polling, and the frontend now filters both
-- polling tables on source = 'fiftyplusone'. Any rows the old importers left
-- behind are snapshotted then removed so a stale 270toWin average can never
-- resurface, and the column defaults stop advertising the dead sources.
--
-- Idempotent: safe to re-run on a project that never had legacy rows.

create table if not exists public.race_polling_backup_20260917 as
  select * from public.race_polling where false;
insert into public.race_polling_backup_20260917
  select * from public.race_polling where source <> 'fiftyplusone';

create table if not exists public.race_polls_backup_20260917 as
  select * from public.race_polls where false;
insert into public.race_polls_backup_20260917
  select * from public.race_polls where source <> 'fiftyplusone';

delete from public.race_polling where source <> 'fiftyplusone';
delete from public.race_polls   where source <> 'fiftyplusone';

alter table public.race_polling alter column source set default 'fiftyplusone';
alter table public.race_polls   alter column source set default 'fiftyplusone';

comment on column public.race_polling.rcp_url is
  'Legacy column from the RealClearPolitics importer; the FiftyPlusOne importer mirrors source_url here. Read source_url.';
comment on column public.race_polling.source is
  'Polling source. Only ''fiftyplusone'' is written or read since 2026-09.';
comment on column public.race_polls.source is
  'Polling source. Only ''fiftyplusone'' is written or read since 2026-09.';
