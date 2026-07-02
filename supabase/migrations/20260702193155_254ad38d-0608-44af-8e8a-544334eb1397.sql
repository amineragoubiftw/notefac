DROP POLICY IF EXISTS "Anyone can create shares" ON public.year_shares;

CREATE POLICY "Anyone can create valid shares"
ON public.year_shares
FOR INSERT
TO anon, authenticated
WITH CHECK (
  share_code ~ '^[A-Z0-9]{4,16}$'
  AND length(major_id) BETWEEN 1 AND 128
  AND (major_name IS NULL OR length(major_name) <= 256)
  AND pg_column_size(payload) <= 65536
);