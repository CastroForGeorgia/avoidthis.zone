-- 1. EXTENSIONS ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- UUID generation
CREATE EXTENSION IF NOT EXISTS "postgis";     -- Geo queries / indexes

-- 2. ENUM types
CREATE TYPE raid_location_category AS ENUM ('Home', 'Public', 'Work', 'Other');
CREATE TYPE detail_location AS ENUM ('Street', 'CarStop', 'Shelter', 'Workplace', 'Other');
CREATE TYPE tactic AS ENUM ('Surveillance', 'Roadblock', 'Checkpoints', 'CanineUnit', 'AirSupport', 'Other');
CREATE TYPE location_reference AS ENUM ('ZIP', 'ADDRESS', 'INTERSECTION', 'NONE');
CREATE TYPE source_of_info AS ENUM ('NewsArticle', 'PersonalObservation', 'OfficialReport', 'Other');
CREATE TYPE vote_type AS ENUM ('upvote','downvote','flag');

-- 3. Main raid_reports table
CREATE TABLE raid_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  location geography(Point,4326),
  date_of_raid TIMESTAMPTZ,
  
  raid_location_category raid_location_category,
  detail_location        detail_location,
  link TEXT,
  tactics_used tactic[],
  
  location_reference location_reference,
  source_of_info     source_of_info,
  
  upvote_count   INTEGER NOT NULL DEFAULT 0,
  downvote_count INTEGER NOT NULL DEFAULT 0,
  flag_count     INTEGER NOT NULL DEFAULT 0,

  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Link to Supabase Auth users

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. raid_report_votes table
CREATE TABLE raid_report_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  report_id UUID NOT NULL
    REFERENCES raid_reports(id)
    ON DELETE CASCADE,
    
  vote_type vote_type NOT NULL,

  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Link to Supabase Auth users

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Indexes
CREATE INDEX idx_raid_reports_geog ON raid_reports USING GIST (location);
CREATE INDEX idx_raid_reports_date ON raid_reports (date_of_raid);

-- 6. Trigger to keep updated_at fresh
CREATE FUNCTION refresh_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_raid_reports_updated
BEFORE UPDATE ON raid_reports
FOR EACH ROW
EXECUTE PROCEDURE refresh_updated_at();