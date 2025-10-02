// Profile interface (renamed from users_info)
export interface Profile {
  id: string;
  auth_id: string;
  username: string | null;
  role: string;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

// League interface
export interface League {
  id?: string;
  name: string;
  owner_id: string;
  draft_completed: boolean;
  created_at?: string;
  settings: Record<string, any>;
}

// League members interface (many-to-many relationship)
export interface LeagueMember {
  league_id: string;
  user_id: string;
  role: string;
  draft_pick_order?: number | null;
  created_at?: string;
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

//Invitations interface
export interface Invitation {
  id?: string;
  league_id: string;
  email: string;
  invited_by: string;
  token?: string;
  status: string;
  expires_at?: string;
  created_at?: string;
}