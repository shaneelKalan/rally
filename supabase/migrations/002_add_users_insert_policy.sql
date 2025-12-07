-- Migration 002: Add INSERT policy for users table
-- This allows authenticated users to create their own profile in public.users

-- Add INSERT policy for users table
-- Users can only insert a row if the id matches their auth.uid()
CREATE POLICY "Users can create own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Alternative: Create a trigger to auto-create user profile on auth signup
-- This is the preferred approach but requires running on the auth schema

-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO public.users (id, email)
--   VALUES (NEW.id, NEW.email);
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
