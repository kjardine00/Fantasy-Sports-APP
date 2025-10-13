// Profile interface (renamed from users_info)
export interface Profile {
  id?: string;
  auth_id?: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
  profile_picture?: string | null;
  created_at?: string;
  updated_at?: string;
}

// League interface
export interface League {
  id?: string;
  name: string;
  owner_id: string;
  draft_completed: boolean;
  short_code: string;
  created_at?: string;
  settings: Record<string, any>;
}

// League members interface (many-to-many relationship)
export interface LeagueMember {
  league_id: string;
  user_id: string;
  role: 'member' | 'commissioner';
  draft_pick_order?: number | null;
  created_at?: string;
  league_number: number | null;
  abbreviation: string | null;
  team_icon?: string | null;
  team_name: string | null;
  status?: 'Pending' | 'Joined';
}

// Matchup interface
export interface Matchup {
  id: string;
  league_id: string;
  week_number: number;
  user1_id: string;
  user2_id: string;
  user1_score: number | null; // numeric in DB
  user2_score: number | null; // numeric in DB
  winner_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Player interface
export interface Player {
  id: string;
  name: string;
  team: string;
  points: {
    Batting?: number;
    Pitching?: number;
    Total?: number;
    [key: string]: any; // Allow for other properties
  } | null;
}

// Roster interface
export interface Roster {
  id: string;
  league_id: string;
  user_id: string;
  player_id: string | null;
  slot_role: string;
  slot_number: number;
  locked: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

// Trade interface
export interface Trade {
  id: string;
  league_id: string;
  from_user_id: string;
  to_user_id: string;
  player_id: string;
  status: string | null;
  created_at: string | null;
  completed_at: string | null;
}

//Invite interface
export interface Invite {
  id?: string; // DB generated
  league_id: string;
  email?: string;
  invited_by: string;
  token?: string;
  status: 'pending' | 'accepted' | 'expired'; // general invites will be pending until max uses is reached or league is full
  expires_at?: string;
  created_at?: string; // DB generated
  accepted_at?: string;
  max_uses?: number | null; // null = unlimited uses
  current_uses?: number; // DB default is 0
  invite_type?: 'email' | 'general'; // 'email' for specific invites, 'general' for generic links
}
