-- Create invitations table for league invitations
CREATE TABLE invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES profiles(auth_id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- League owners can manage invitations
CREATE POLICY "League owners can manage invitations" ON invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM leagues 
      WHERE id = invitations.league_id 
      AND owner_id = auth.uid()
    )
  );

-- Users can view invitations sent to their email
CREATE POLICY "Users can view their invitations" ON invitations
  FOR SELECT USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Create index for faster lookups
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_league_id ON invitations(league_id);
