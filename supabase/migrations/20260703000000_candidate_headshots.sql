-- Candidate headshots, hotlinked from Wikimedia Commons at Wikimedia's
-- quantized thumb widths (330 / 960 / 1280px).
--
-- Sources & licenses:
--   Greg Abbott    — "Greg Abbott at NASA 2024 (cropped).jpg", public domain (NASA)
--   Gina Hinojosa  — "Gina Hinojosa at LBJ Library Forum (3x4 cropped).jpg",
--                    public domain (original is 800px wide, used as medium/large)
--   Andrew White   — "Andrew White Announcement (1).jpg", CC BY-SA 4.0
--                    (credit noted in the FAQ's photo-credits line)
--   Pete Chambers, Bobby Cole — no freely licensed image found on Wikimedia
--                    Commons; the UI falls back to initials.

update public.tx_candidates set
  photo_url_thumb  = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Greg_Abbott_at_NASA_2024_%28cropped%29.jpg/330px-Greg_Abbott_at_NASA_2024_%28cropped%29.jpg',
  photo_url_medium = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Greg_Abbott_at_NASA_2024_%28cropped%29.jpg/960px-Greg_Abbott_at_NASA_2024_%28cropped%29.jpg',
  photo_url_large  = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Greg_Abbott_at_NASA_2024_%28cropped%29.jpg/1280px-Greg_Abbott_at_NASA_2024_%28cropped%29.jpg',
  photo_url        = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Greg_Abbott_at_NASA_2024_%28cropped%29.jpg/960px-Greg_Abbott_at_NASA_2024_%28cropped%29.jpg'
where slug = 'greg-abbott';

update public.tx_candidates set
  photo_url_thumb  = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Gina_Hinojosa_at_LBJ_Library_Forum_%283x4_cropped%29.jpg/330px-Gina_Hinojosa_at_LBJ_Library_Forum_%283x4_cropped%29.jpg',
  photo_url_medium = 'https://upload.wikimedia.org/wikipedia/commons/1/13/Gina_Hinojosa_at_LBJ_Library_Forum_%283x4_cropped%29.jpg',
  photo_url_large  = 'https://upload.wikimedia.org/wikipedia/commons/1/13/Gina_Hinojosa_at_LBJ_Library_Forum_%283x4_cropped%29.jpg',
  photo_url        = 'https://upload.wikimedia.org/wikipedia/commons/1/13/Gina_Hinojosa_at_LBJ_Library_Forum_%283x4_cropped%29.jpg'
where slug = 'gina-hinojosa';

update public.tx_candidates set
  photo_url_thumb  = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Andrew_White_Announcement_%281%29.jpg/330px-Andrew_White_Announcement_%281%29.jpg',
  photo_url_medium = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Andrew_White_Announcement_%281%29.jpg/960px-Andrew_White_Announcement_%281%29.jpg',
  photo_url_large  = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Andrew_White_Announcement_%281%29.jpg/1280px-Andrew_White_Announcement_%281%29.jpg',
  photo_url        = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Andrew_White_Announcement_%281%29.jpg/960px-Andrew_White_Announcement_%281%29.jpg'
where slug = 'andrew-white';
