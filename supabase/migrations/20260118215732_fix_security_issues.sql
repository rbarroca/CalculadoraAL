/*
  # Fix Security Issues
  
  ## Changes
  1. Drop unused `layout_preferences` table
     - This table is not used in the application
     - Removes unused index `idx_layout_preferences_session_id`
     - Removes insecure RLS policies that allow unrestricted access
  
  ## Security Improvements
  - Eliminates RLS policies with `true` conditions that bypass security
  - Removes redundant unused index
  - Cleans up unused database objects
  
  ## Note
  The Auth DB connection strategy issue requires manual configuration in the Supabase dashboard:
  - Navigate to: Project Settings > Database > Connection Pooling
  - Change from fixed connection count to percentage-based allocation
*/

-- Drop the unused table (this also removes all indexes and policies)
DROP TABLE IF EXISTS public.layout_preferences CASCADE;
