-- Test data for players table
-- Creates 20 players: 10 for team_1 and 10 for team_2

-- First, insert the basic player records
INSERT INTO players (name, team, stats) VALUES
-- Team 1 players
('player_1', 'team_1', '{}'),
('player_2', 'team_1', '{}'),
('player_3', 'team_1', '{}'),
('player_4', 'team_1', '{}'),
('player_5', 'team_1', '{}'),
('player_6', 'team_1', '{}'),
('player_7', 'team_1', '{}'),
('player_8', 'team_1', '{}'),
('player_9', 'team_1', '{}'),
('player_10', 'team_1', '{}'),

-- Team 2 players
('player_11', 'team_2', '{}'),
('player_12', 'team_2', '{}'),
('player_13', 'team_2', '{}'),
('player_14', 'team_2', '{}'),
('player_15', 'team_2', '{}'),
('player_16', 'team_2', '{}'),
('player_17', 'team_2', '{}'),
('player_18', 'team_2', '{}'),
('player_19', 'team_2', '{}'),
('player_20', 'team_2', '{}');

-- Update all players with new stats structure and random values
UPDATE players SET stats = jsonb_build_object(
  'Batting', jsonb_build_object(
    'Singles', floor(random() * 9 + 1)::int,
    'Doubles', floor(random() * 9 + 1)::int,
    'Triples', floor(random() * 9 + 1)::int,
    'Homeruns', floor(random() * 4 + 1)::int,
    'RBI', floor(random() * 15 + 1)::int,
    'Walks', floor(random() * 5 + 1)::int,
    'Hit By Pitch', floor(random() * 5 + 1)::int,
    'Strikeouts', floor(random() * 9 + 1)::int
  ),
  'Pitching', jsonb_build_object(
    'Wins', floor(random() * 3 + 1)::int,
    'Strikeouts', floor(random() * 9 + 1)::int,
    'Batters Faced', floor(random() * 15 + 1)::int,
    'Runs Allowed', floor(random() * 9 + 1)::int
  )
);