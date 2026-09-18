-- FiftyPlusOne is the only polling source for the Texas tracker.
--
-- The RealClearPolitics (source = 'rcp') and 270toWin (source = '270towin')
-- importers inherited from the CA repo are retired: their edge functions and
-- scripts are deleted, the polling-sync workflow only ever called
-- import-fiftyplusone-polling, and the frontend filters both polling tables
-- on source = 'fiftyplusone'. Any rows the old importers left behind for
-- TEXAS races are snapshotted then removed so a stale average can never
-- resurface.
--
-- SCOPE: Texas races only (races.state = 'Texas'). This Supabase project is
-- shared with the multi-state governor tracker, whose other-state races carry
-- 270toWin rows that ARE still written and read by that app. Those rows are
-- not this repo's to delete, so nothing here touches them, and the source
-- column defaults are left alone for the same reason.
--
-- Idempotent: the backup tables are only created when there is something to
-- back up, so re-running on a clean project is a no-op.

do $$
declare
  n_polling integer;
  n_polls   integer;
begin
  select count(*) into n_polling
    from public.race_polling p
    join public.races r using (race_id)
   where r.state = 'Texas' and p.source <> 'fiftyplusone';

  select count(*) into n_polls
    from public.race_polls p
    join public.races r using (race_id)
   where r.state = 'Texas' and p.source <> 'fiftyplusone';

  if n_polling > 0 then
    create table if not exists public.race_polling_backup_20260917 as
      select * from public.race_polling where false;
    insert into public.race_polling_backup_20260917
      select p.* from public.race_polling p
        join public.races r using (race_id)
       where r.state = 'Texas' and p.source <> 'fiftyplusone';
    delete from public.race_polling p
     using public.races r
     where r.race_id = p.race_id and r.state = 'Texas' and p.source <> 'fiftyplusone';
  end if;

  if n_polls > 0 then
    create table if not exists public.race_polls_backup_20260917 as
      select * from public.race_polls where false;
    insert into public.race_polls_backup_20260917
      select p.* from public.race_polls p
        join public.races r using (race_id)
       where r.state = 'Texas' and p.source <> 'fiftyplusone';
    delete from public.race_polls p
     using public.races r
     where r.race_id = p.race_id and r.state = 'Texas' and p.source <> 'fiftyplusone';
  end if;

  raise notice 'fiftyplusone_only_polling: removed % race_polling and % race_polls legacy Texas rows', n_polling, n_polls;
end $$;
