-- ==============================================
-- Optional: Row Level Security (RLS)
-- Run this in Supabase SQL Editor AFTER the main schema
-- if you want to enable RLS. These policies allow full
-- access for the anon key (used by your Next.js server).
-- Tighten policies for production (e.g. by user role).
-- ==============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_records ENABLE ROW LEVEL SECURITY;

-- Permissive policies: allow all for service role / anon (app uses NextAuth, not Supabase Auth).
-- Replace with stricter policies (e.g. by role) when using Supabase Auth or for production.

CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for treatments" ON treatments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for treatment_records" ON treatment_records FOR ALL USING (true) WITH CHECK (true);
