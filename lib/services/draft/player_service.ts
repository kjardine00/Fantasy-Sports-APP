import { createClient } from "@/lib/database/server";
import { Player, RealTeams } from "@/lib/types/database_types";
import { Result, success, failure } from "@/lib/types";
import { findAll, find } from "@/lib/database/queries/players_queries";
import { findAll as findAllRealTeams } from "@/lib/database/queries/real_teams_queries";

export class PlayerService {
  static async getPlayerData(playerId: string): Promise<Result<Player>> {
    const player = await find(playerId);
    if (player.error || !player.data) {
      return failure(player.error || "Failed to fetch player");
    }
    return success(player.data);
  }

  static async getAllPlayers(): Promise<Result<Player[]>> {
    const players = await findAll();
    if (players.error || !players.data) {
      return failure(players.error || "Failed to fetch players");
    }
    return success(players.data);
  }

  static async getAllRealTeams(): Promise<Result<RealTeams[]>> {
    const realTeams = await findAllRealTeams();
    if (realTeams.error || !realTeams.data) {
      return failure(realTeams.error || "Failed to fetch real teams");
    }
    return success(realTeams.data);
  }
}
