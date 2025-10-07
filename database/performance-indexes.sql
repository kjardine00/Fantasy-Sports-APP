-- Performance Optimization Indexes for Fantasy Sports App
-- ========================================================
-- Run these indexes in your Supabase SQL editor to improve query performance

-- 1. LEAGUES TABLE INDEXES
-- ========================

-- Index for short_code lookups (used in getLeagueByShortCode)
CREATE INDEX IF NOT EXISTS idx_leagues_short_code ON leagues(short_code);

-- Index for owner_id lookups (used in league ownership checks)
CREATE INDEX IF NOT EXISTS idx_leagues_owner_id ON leagues(owner_id);

-- 2. LEAGUES_MEMBERS TABLE INDEXES
-- ================================

-- Composite index for league_id + user_id lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_leagues_members_league_user ON leagues_members(league_id, user_id);

-- Index for league_id lookups (used in getAllLeaguesMembersAndUserInfo)
CREATE INDEX IF NOT EXISTS idx_leagues_members_league_id ON leagues_members(league_id);

-- Index for user_id lookups (used in membership validation)
CREATE INDEX IF NOT EXISTS idx_leagues_members_user_id ON leagues_members(user_id);

-- Index for league_number sorting (used in member ordering)
CREATE INDEX IF NOT EXISTS idx_leagues_members_league_number ON leagues_members(league_id, league_number);

-- Index for draft_pick_order sorting
CREATE INDEX IF NOT EXISTS idx_leagues_members_draft_order ON leagues_members(league_id, draft_pick_order);

-- 3. PROFILES TABLE INDEXES
-- ==========================

-- Index for auth_id lookups (used in profile joins)
CREATE INDEX IF NOT EXISTS idx_profiles_auth_id ON profiles(auth_id);

-- Index for username lookups (if used in searches)
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- 4. INVITATIONS TABLE INDEXES (already exist, but listed for reference)
-- ======================================================================

-- These should already exist based on your invitations-schema.sql:
-- CREATE INDEX idx_invitations_token ON invitations(token);
-- CREATE INDEX idx_invitations_email ON invitations(email);
-- CREATE INDEX idx_invitations_league_id ON invitations(league_id);

-- 5. FOREIGN KEY RELATIONSHIP
-- ===========================

-- The foreign key relationship already exists in your database:
-- leagues_members.user_id -> profiles.auth_id
-- This allows the JOIN query to work properly

-- 6. ANALYZE TABLES (run after creating indexes)
-- ==============================================

-- Update table statistics for better query planning
ANALYZE leagues;
ANALYZE leagues_members;
ANALYZE profiles;
ANALYZE invitations;
