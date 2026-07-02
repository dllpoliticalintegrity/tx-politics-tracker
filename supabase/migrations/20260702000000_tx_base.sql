-- Base schema for the TX Politics Tracker Supabase project.
--
-- Consolidates the pieces the CA repo inherited from its shared "Integrity
-- Index" project (where `races` and update_updated_at_column() predated the
-- migration history) into one coherent bootstrap for a fresh project:
--   - update_updated_at_column() helper
--   - races (minimal: what the polling importers + frontend actually read)
--   - profiles + signup trigger (auth)
--   - password_reset_tokens + get_user_id_by_email (custom reset flow used
--     by the request-password-reset / reset-password edge functions)

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Races. The polling importers key on (slug, year); rcp_url is legacy from
-- the RCP importer.
-- ---------------------------------------------------------------------------
CREATE TABLE public.races (
  race_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text,
  district text,
  slug text UNIQUE,
  year bigint,
  rcp_url text,
  featured boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Races are publicly readable"
  ON public.races FOR SELECT USING (true);

-- ---------------------------------------------------------------------------
-- Profiles (auth)
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(
    NEW.raw_user_meta_data->>'username',
    'user_' || LEFT(NEW.id::text, 8)
  ));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Custom password reset (bypasses Supabase Auth rate limits)
-- ---------------------------------------------------------------------------
CREATE TABLE public.password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '1 hour'),
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- No RLS select policies needed - only accessed via service role in edge functions
CREATE INDEX idx_password_reset_tokens_hash ON public.password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_tokens_expires ON public.password_reset_tokens(expires_at);

-- Function to look up user ID by email (service role only)
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(lookup_email text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM auth.users WHERE email = lower(lookup_email) LIMIT 1;
$$;
