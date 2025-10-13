/**
 * Database table names
 * Single source of truth for all table references
 */

export const TABLES = {
    INVITES: "invites",
    LEAGUES: "leagues",
    LEAGUES_MEMBERS: "leagues_members",
    MATCHUPS: "matchups",
    PLAYERS: "players",
    PROFILES: "profiles",
    ROSTERS: "rosters",
    TRADES: "trades",
} as const;

export type TableName = typeof TABLES[keyof typeof TABLES];