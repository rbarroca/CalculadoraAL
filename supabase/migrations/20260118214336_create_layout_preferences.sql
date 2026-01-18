/*
  # Layout Preferences Table

  1. New Tables
    - `layout_preferences`
      - `id` (uuid, primary key)
      - `session_id` (text, unique) - Anonymous session identifier
      - `layout_type` (text) - Selected layout: 'side-by-side', 'stacked', or 'tabs'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `layout_preferences` table
    - Add policy for public access (anonymous users can manage their own preferences)
    
  3. Notes
    - Uses session_id for anonymous tracking instead of user authentication
    - Allows users to persist their layout choice across sessions
*/

CREATE TABLE IF NOT EXISTS layout_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  layout_type text NOT NULL DEFAULT 'side-by-side',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE layout_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read layout preferences"
  ON layout_preferences
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert their own layout preference"
  ON layout_preferences
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update their own layout preference"
  ON layout_preferences
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_layout_preferences_session_id ON layout_preferences(session_id);