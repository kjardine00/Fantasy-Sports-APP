export class LeagueActionError extends Error {
  constructor(
    message: string,
    public code: "AUTH_REQUIRED" | "LEAGUE_CREATION_FAILED" | "INVITE_CREATION_FAILED" | "LEAGUE_SETTINGS_UPDATE_FAILED" | "DRAFT_SCHEDULE_FAILED"
  ) {
    super(message);
    this.name = "LeagueActionError";
  }
}

export type LeagueActionErrorCode = "AUTH_REQUIRED" | "LEAGUE_CREATION_FAILED" | "INVITE_CREATION_FAILED" | "LEAGUE_SETTINGS_UPDATE_FAILED" | "DRAFT_SCHEDULE_FAILED";

export type LeagueActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; errorCode: LeagueActionErrorCode };