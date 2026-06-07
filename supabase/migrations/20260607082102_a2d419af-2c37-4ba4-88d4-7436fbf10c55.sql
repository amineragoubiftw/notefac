
CREATE TABLE public.year_shares (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  share_code text NOT NULL UNIQUE,
  major_id text NOT NULL,
  major_name text,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX year_shares_share_code_idx ON public.year_shares (share_code);

GRANT SELECT, INSERT ON public.year_shares TO anon, authenticated;
GRANT ALL ON public.year_shares TO service_role;

ALTER TABLE public.year_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shares" ON public.year_shares FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can create shares" ON public.year_shares FOR INSERT TO anon, authenticated WITH CHECK (true);
