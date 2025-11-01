export interface SettingsFormState {
    leagueName: string;
    numberOfTeams: number;
    isPublic: boolean;
    draftType: "snake" | "auction" | "offline";
    scheduledStart: string;
    timePerPick: number;
    rosterSize: number;
    totalStartingPlayers: number;
    allowDuplicatePicks: boolean;
    numberOfDuplicates: number;
    useChemistry: boolean;
    chemistryMultiplier: number;
    useBigPlays: boolean;
    bigPlaysMultiplier: number;
  }

export interface CreateLeagueData {
  name: string;
  numberOfTeams: number;
  useChemistry: boolean;
  numOfDuplicatePlayers: number;
}