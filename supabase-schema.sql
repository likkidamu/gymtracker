-- Run this in Supabase Dashboard → SQL Editor → New Query → Run

-- Food entries table
CREATE TABLE food_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo TEXT,
  thumbnail TEXT,
  meal_type TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  ai_analysis JSONB,
  manual_override JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Progress entries table
CREATE TABLE progress_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo TEXT,
  thumbnail TEXT,
  date TEXT NOT NULL,
  weight DECIMAL,
  body_fat_percentage DECIMAL,
  measurements JSONB,
  ai_analysis JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Training plans table
CREATE TABLE training_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  goal TEXT NOT NULL,
  fitness_level TEXT NOT NULL,
  days_per_week INTEGER NOT NULL,
  equipment TEXT[],
  duration TEXT,
  workout_days JSONB,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (users can only see their own data)
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;

-- Policies: users can CRUD only their own rows
CREATE POLICY "Users can view own food entries" ON food_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own food entries" ON food_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own food entries" ON food_entries
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own food entries" ON food_entries
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress entries" ON progress_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress entries" ON progress_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress entries" ON progress_entries
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress entries" ON progress_entries
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own training plans" ON training_plans
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own training plans" ON training_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own training plans" ON training_plans
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own training plans" ON training_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER food_entries_updated_at BEFORE UPDATE ON food_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER progress_entries_updated_at BEFORE UPDATE ON progress_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER training_plans_updated_at BEFORE UPDATE ON training_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
