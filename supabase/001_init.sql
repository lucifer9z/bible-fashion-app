-- BibleFashion Phase 2 — Database Schema
-- Run this in Supabase SQL Editor

-- Daily data (số liệu ngày)
CREATE TABLE daily_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  fb_spend INT DEFAULT 0,
  fb_inbox INT DEFAULT 0,
  fb_orders INT DEFAULT 0,
  fb_revenue INT DEFAULT 0,
  sp_organic INT DEFAULT 0,
  sp_paid INT DEFAULT 0,
  sp_revenue INT DEFAULT 0,
  sp_spend INT DEFAULT 0,
  tt_views INT DEFAULT 0,
  tt_orders INT DEFAULT 0,
  tt_revenue INT DEFAULT 0,
  tt_followers INT DEFAULT 0,
  fl_shipped INT DEFAULT 0,
  fl_delivered INT DEFAULT 0,
  fl_boom INT DEFAULT 0,
  fl_return INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tasks
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  text TEXT NOT NULL,
  role TEXT NOT NULL,
  time_slot TEXT NOT NULL DEFAULT 'morning',
  done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- War Stories
CREATE TABLE war_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  module TEXT,
  author TEXT,
  content TEXT,
  before_data TEXT,
  after_data TEXT,
  lesson TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SKUs (quản lý sản phẩm)
CREATE TABLE skus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'jean',
  cost_price INT DEFAULT 0,
  sell_price_fb INT DEFAULT 0,
  sell_price_shopee INT DEFAULT 0,
  sell_price_tiktok INT DEFAULT 0,
  stock INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Content Calendar
CREATE TABLE content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'video',
  platform TEXT DEFAULT 'tiktok',
  status TEXT DEFAULT 'idea',
  assigned_to TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings (project start date, etc.)
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT
);

-- Enable Row Level Security
ALTER TABLE daily_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE war_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (for team use — all authenticated users)
CREATE POLICY "Allow all for authenticated" ON daily_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON war_stories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON skus FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON content_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON settings FOR ALL USING (true) WITH CHECK (true);

-- Insert default settings
INSERT INTO settings (key, value) VALUES ('start_date', NULL);
INSERT INTO settings (key, value) VALUES ('project_name', 'BibleFashion');
