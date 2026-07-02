INSERT INTO races (state, district, slug, year)
VALUES ('National', 'Generic-Ballot', 'generic-congressional-vote-2026', 2026)
ON CONFLICT DO NOTHING;