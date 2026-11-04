/*
# Create exercise_attempts table

1. New Tables
- `exercise_attempts`
  - `id` (uuid, primary key)
  - `user_id` (uuid, owner, defaults to the signed-in user)
  - `exercise_type` (text, which kind of exercise was answered)
  - `is_correct` (boolean, whether the answer was right)
  - `created_at` (timestamp)

2. Security
- Enable RLS on `exercise_attempts`.
- Grant SELECT and INSERT to `authenticated` only.
- Each user can read and insert only their own attempts.

3. Notes
- Only signed-in users write rows; anonymous visitors can still use the exercises without saving results.
*/

CREATE TABLE IF NOT EXISTS exercise_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_type text NOT NULL,
  is_correct boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS exercise_attempts_user_id_idx ON exercise_attempts (user_id);

ALTER TABLE exercise_attempts ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON exercise_attempts TO authenticated;

DROP POLICY IF EXISTS "select_own_exercise_attempts" ON exercise_attempts;
CREATE POLICY "select_own_exercise_attempts" ON exercise_attempts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_exercise_attempts" ON exercise_attempts;
CREATE POLICY "insert_own_exercise_attempts" ON exercise_attempts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
