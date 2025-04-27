-- 1. EXTENSIONS ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";   -- UUID generation
create extension if not exists "postgis";     -- Geo queries / indexes

-- 1. ENUM types for all our finite lists
CREATE TYPE raid_location_category AS ENUM (
  'Home',
  'Public',
  'Work',
  'Other'
);

CREATE TYPE detail_location AS ENUM (
  'Street',
  'CarStop',
  'Shelter',
  'Workplace',
  'Other'
);

CREATE TYPE tactic AS ENUM (
  'Surveillance',
  'Roadblock',
  'Checkpoints',
  'CanineUnit',
  'AirSupport',
  'Other'
);

CREATE TYPE location_reference AS ENUM (
  'ZIP',
  'ADDRESS',
  'INTERSECTION',
  'NONE'
);

CREATE TYPE source_of_info AS ENUM (
  'NewsArticle',
  'PersonalObservation',
  'OfficialReport',
  'Other'
);

-- 2. Main raid_reports table
CREATE TABLE raid_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- geography point for lat/lng, SRID 4326
  location geography(Point,4326) NOT NULL,
  
  date_of_raid TIMESTAMPTZ NOT NULL,
  
  raid_location_category raid_location_category NOT NULL,
  detail_location        detail_location        NOT NULL,
  
  tactics_used tactic[] NOT NULL,
  
  location_reference  location_reference NOT NULL,
  source_of_info      source_of_info     NOT NULL,
  
  upvote_count   INTEGER NOT NULL DEFAULT 0,
  downvote_count INTEGER NOT NULL DEFAULT 0,
  flag_count     INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Indexes to power our “us vs. the system” geo-queries
CREATE INDEX idx_raid_reports_geog ON raid_reports USING GIST (location);
CREATE INDEX idx_raid_reports_geohash ON raid_reports (geohash);
CREATE INDEX idx_raid_reports_date ON raid_reports (date_of_raid);

-- 4. (Optional) Detailed vote audit table, if you need to trace individual votes
CREATE TYPE vote_type AS ENUM ('upvote','downvote','flag');

CREATE TABLE raid_report_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL
    REFERENCES raid_reports(id)
    ON DELETE CASCADE,
  vote_type vote_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Trigger to keep updated_at fresh
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