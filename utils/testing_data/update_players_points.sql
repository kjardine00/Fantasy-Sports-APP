-- Update script to add points column and calculate individual fantasy points for existing players
-- This script updates all 120 existing players in the database

-- Step 1: Add points column to players table (if it doesn't exist)
ALTER TABLE players ADD COLUMN IF NOT EXISTS points JSONB DEFAULT '{}';

-- Step 2: Calculate and update individual points for all existing players
-- Based on the scoring system from Scoring.txt:
-- Batting: Singles(1pt), Doubles(2pts), Triples(3pts), Homeruns(4pts), RBI(1pt), Walks(1pt), Hit By Pitch(1pt), Strikeouts(-1pt)
-- Pitching: Wins(4pts), Strikeouts(2pts), Batters Faced(1pt per 3), Earned Runs Allowed(-1pt)

UPDATE players 
SET points = jsonb_build_object(
  'Batting', jsonb_build_object(
    'Singles', COALESCE((stats->>'Singles')::int, 0) * 1,
    'Doubles', COALESCE((stats->>'Doubles')::int, 0) * 2,
    'Triples', COALESCE((stats->>'Triples')::int, 0) * 3,
    'Homeruns', COALESCE((stats->>'Homeruns')::int, 0) * 4,
    'RBI', COALESCE((stats->>'RBI')::int, 0) * 1,
    'Walks', COALESCE((stats->>'Walks')::int, 0) * 1,
    'Hit By Pitch', COALESCE((stats->>'Hit By Pitch')::int, 0) * 1,
    'Strikeouts', COALESCE((stats->>'Strikeouts')::int, 0) * -1
  ),
  'Pitching', jsonb_build_object(
    'Wins', COALESCE((stats->>'Wins')::int, 0) * 4,
    'Strikeouts', COALESCE((stats->>'Strikeouts')::int, 0) * 2,
    'Batters Faced', COALESCE((stats->>'Batters Faced')::int, 0) / 3.0,
    'Runs Allowed', COALESCE((stats->>'Runs Allowed')::int, 0) * -1
  ),
  'Total', (
    -- Batting points
    (COALESCE((stats->>'Singles')::int, 0) * 1) +
    (COALESCE((stats->>'Doubles')::int, 0) * 2) +
    (COALESCE((stats->>'Triples')::int, 0) * 3) +
    (COALESCE((stats->>'Homeruns')::int, 0) * 4) +
    (COALESCE((stats->>'RBI')::int, 0) * 1) +
    (COALESCE((stats->>'Walks')::int, 0) * 1) +
    (COALESCE((stats->>'Hit By Pitch')::int, 0) * 1) +
    (COALESCE((stats->>'Strikeouts')::int, 0) * -1) +
    
    -- Pitching points
    (COALESCE((stats->>'Wins')::int, 0) * 4) +
    (COALESCE((stats->>'Strikeouts')::int, 0) * 2) +
    (COALESCE((stats->>'Batters Faced')::int, 0) / 3.0) +
    (COALESCE((stats->>'Runs Allowed')::int, 0) * -1)
  )
)
WHERE stats IS NOT NULL;

-- Step 3: Verify the update (optional - shows sample results)
-- SELECT name, team, points FROM players ORDER BY (points->>'Total')::numeric DESC LIMIT 10;

-- Step 4: Show summary statistics
SELECT 
  COUNT(*) as total_players,
  AVG((points->>'Total')::numeric) as avg_points,
  MIN((points->>'Total')::numeric) as min_points,
  MAX((points->>'Total')::numeric) as max_points,
  SUM((points->>'Total')::numeric) as total_points
FROM players
WHERE points IS NOT NULL AND points != '{}';
