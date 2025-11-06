import { createClient } from "@/lib/database/server";
import { TABLES } from "@/lib/database/tables";
import { Player } from "@/lib/types/database_types";
import { Result, failure, success } from "@/lib/types";

export async function findAll(): Promise<Result<Player[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase.from(TABLES.PLAYERS).select("*");

  if (error) {
    return failure(error.message);
  }
  return success(data);
}

export async function find(playerId: string): Promise<Result<Player>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.PLAYERS)
    .select("*")
    .eq("id", playerId)
    .single();
  if (error) {
    return failure(error.message);
  }
  return success(data);
}
