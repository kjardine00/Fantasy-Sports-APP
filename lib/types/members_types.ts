export interface MemberRow {
  league_number: number;
  abbreviation: string;
  team_icon: string;
  team_name: string;
  manager_name: string;
  status: string;
  user_id?: string; // Optional for sorting purposes
}
