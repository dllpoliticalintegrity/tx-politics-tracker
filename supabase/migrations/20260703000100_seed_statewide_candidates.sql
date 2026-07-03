-- Statewide down-ballot races: Lt. Governor and Attorney General 2026.
-- Curated from `import_tx_finance.py --discover --office LTGOVERNOR|ATTYGEN`
-- plus the March 3 primary / May 26 runoff results.
--
-- General matchups: Patrick (R) vs Goodwin (D) for Lt. Governor;
-- Middleton (R) vs Nathan Johnson (D) for Attorney General.
--
-- Photo sources (Wikimedia Commons): Patrick (Redwhiteandboujee, CC BY-SA 4.0),
-- Goodwin (Cole-Wilson-93, CC BY-SA 4.0), Middleton (Gage Skidmore,
-- CC BY-SA 3.0), Roy (U.S. Congress, public domain), Reitz (OLP1870,
-- CC BY-SA 4.0), Huffman (euthman/Flickr, CC BY-SA 2.0). Johnson, Vélez,
-- Collier, Jaworski: no freely licensed image found; initials fallback.
insert into public.tx_candidates
  (slug, name, party, filer_ident, committee_filer_ident, committee_name, office, title, status, featured,
   photo_url_thumb, photo_url_medium, photo_url_large, photo_url)
values
  -- ── Lt. Governor ────────────────────────────────────────────────────────
  ('dan-patrick', 'Dan Patrick', 'Republican', '57897', '64090', 'Texans for Dan Patrick',
   'LTGOVERNOR', 'Lieutenant Governor of Texas', 'active', true,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Dan_Patrick_Texas_%28cropped%29.jpg/330px-Dan_Patrick_Texas_%28cropped%29.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/4/41/Dan_Patrick_Texas_%28cropped%29.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/4/41/Dan_Patrick_Texas_%28cropped%29.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/4/41/Dan_Patrick_Texas_%28cropped%29.jpg'),
  ('vikki-goodwin', 'Vikki Goodwin', 'Democrat', '81436', null, null,
   'LTGOVERNOR', 'State Representative', 'active', true,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/HiRes-Vikki_Goodwin-6381-red.jpg/330px-HiRes-Vikki_Goodwin-6381-red.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/HiRes-Vikki_Goodwin-6381-red.jpg/960px-HiRes-Vikki_Goodwin-6381-red.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/HiRes-Vikki_Goodwin-6381-red.jpg/1280px-HiRes-Vikki_Goodwin-6381-red.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/HiRes-Vikki_Goodwin-6381-red.jpg/960px-HiRes-Vikki_Goodwin-6381-red.jpg'),
  -- Lost the May 26 Democratic runoff.
  ('marcos-velez', 'Marcos Velez', 'Democrat', '90323', null, null,
   'LTGOVERNOR', null, 'eliminated', false, null, null, null, null),
  -- Withdrew before the primary.
  ('mike-collier', 'Mike Collier', 'Democrat', '69397', null, null,
   'LTGOVERNOR', null, 'withdrawn', false, null, null, null, null),

  -- ── Attorney General ────────────────────────────────────────────────────
  ('mayes-middleton', 'Mayes Middleton', 'Republican', '81727', null, null,
   'ATTYGEN', 'State Senator', 'active', true,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Mayes_Middleton_by_Gage_Skidmore.jpg/330px-Mayes_Middleton_by_Gage_Skidmore.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Mayes_Middleton_by_Gage_Skidmore.jpg/960px-Mayes_Middleton_by_Gage_Skidmore.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Mayes_Middleton_by_Gage_Skidmore.jpg/1280px-Mayes_Middleton_by_Gage_Skidmore.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Mayes_Middleton_by_Gage_Skidmore.jpg/960px-Mayes_Middleton_by_Gage_Skidmore.jpg'),
  -- TEC CTA still shows STATESEN on his COH account; his AG money runs
  -- through the same account.
  ('nathan-johnson', 'Nathan Johnson', 'Democrat', '81605', null, null,
   'ATTYGEN', 'State Senator', 'active', true, null, null, null, null),
  -- Lost the May 26 Republican runoff; raised through SPAC 89953.
  ('chip-roy', 'Chip Roy', 'Republican', '89952', '89953', 'Texans for Chip Roy',
   'ATTYGEN', 'U.S. Representative', 'eliminated', false,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Chip_Roy_118th_Congress.jpg/330px-Chip_Roy_118th_Congress.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/d/de/Chip_Roy_118th_Congress.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/d/de/Chip_Roy_118th_Congress.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/d/de/Chip_Roy_118th_Congress.jpg'),
  -- Lost the May 26 Democratic runoff.
  ('joe-jaworski', 'Joe Jaworski', 'Democrat', '84866', null, null,
   'ATTYGEN', null, 'eliminated', false, null, null, null, null),
  -- Eliminated in the March 3 Republican primary.
  ('aaron-reitz', 'Aaron Reitz', 'Republican', '83762', null, null,
   'ATTYGEN', null, 'eliminated', false,
   'https://upload.wikimedia.org/wikipedia/commons/7/77/Aaron_F._Reitz.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/7/77/Aaron_F._Reitz.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/7/77/Aaron_F._Reitz.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/7/77/Aaron_F._Reitz.jpg'),
  -- Eliminated in the March 3 Republican primary; raised through SPAC 65047.
  ('joan-huffman', 'Joan Huffman', 'Republican', '37510', '65047', 'Texans for Joan Huffman',
   'ATTYGEN', 'State Senator', 'eliminated', false,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Joan_Huffman.jpg/330px-Joan_Huffman.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/9/98/Joan_Huffman.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/9/98/Joan_Huffman.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/9/98/Joan_Huffman.jpg')
on conflict (slug) do nothing;
