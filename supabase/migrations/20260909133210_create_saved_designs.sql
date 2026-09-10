/*
# Create saved interior design recommendations

1. New Tables
- `saved_designs` stores a signed-in user's saved room recommendations.
- `id` is the unique saved item identifier.
- `user_id` links each item to its owner and defaults to the current signed-in user.
- `room_type` stores the selected room category.
- `style` stores the selected design direction.
- `palette_name` stores the curated palette name.
- `colors` stores the recommended color names and hex values as JSON.
- `created_at` stores when the recommendation was saved.

2. Security
- Row Level Security is enabled on `saved_designs`.
- Authenticated users can only read, create, update, and delete their own saved recommendations.
- Anonymous users cannot access saved recommendations.

3. Important Notes
- The owner is assigned by the database using `auth.uid()` so the browser does not control ownership.
- Policies are separated by CRUD action for least-privilege access.
*/

CREATE TABLE IF NOT EXISTS public.saved_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  room_type text NOT NULL,
  style text NOT NULL,
  palette_name text NOT NULL,
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_designs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own saved designs" ON public.saved_designs;
CREATE POLICY "Users can view own saved designs"
  ON public.saved_designs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own saved designs" ON public.saved_designs;
CREATE POLICY "Users can create own saved designs"
  ON public.saved_designs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own saved designs" ON public.saved_designs;
CREATE POLICY "Users can update own saved designs"
  ON public.saved_designs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved designs" ON public.saved_designs;
CREATE POLICY "Users can delete own saved designs"
  ON public.saved_designs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS saved_designs_user_id_created_at_idx
  ON public.saved_designs (user_id, created_at DESC);