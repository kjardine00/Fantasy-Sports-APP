import { createClient } from "@/lib/database/server";
import { TABLES } from "@/lib/database/tables";
import { Invite } from "@/lib/types/database_types";
import { Result, success, failure } from "@/lib/types";

// Find, Create, Update, Delete, Exists, Count

// ============== FIND ==============
export async function findById(inviteId: string): Promise<Result<Invite>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.INVITES)
    .select("*")
    .eq("id", inviteId)
    .single();

  if (error) {
    return failure(error.message);
  }
  return success(data);
}

export async function findByLeagueId(
  leagueId: string
): Promise<Result<Invite[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.INVITES)
    .select("*")
    .eq("league_id", leagueId);

  if (error) {
    return failure(error.message);
  }
  // Ensure data is always an array, even if Supabase returns null
  return success(data ?? []);
}

export async function findByToken(token: string): Promise<Result<Invite>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.INVITES)
    .select("*")
    .eq("token", token)
    .single();

  if (error) {
    return failure(error.message);
  }
  return success(data);
}

export async function findGenericByLeagueId(
  leagueId: string
): Promise<Result<Invite>> {
  const supabase = await createClient();
  const { data: invite, error } = await supabase
    .from(TABLES.INVITES)
    .select("*")
    .eq("league_id", leagueId)
    .eq("invite_type", "general")
    .eq("status", "pending")
    .single();

  if (error) {
    return failure(error.message);
  }
  return success(invite);
}

// ============== CREATE ==============
export async function create(invite: Invite): Promise<Result<Invite>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.INVITES)
    .insert(invite)
    .select()
    .single();

  if (error) {
    return failure(error.message);
  }
  return success(data);
}

// ============== UPDATE ==============
export async function update(invite: Invite): Promise<Result<Invite>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.INVITES)
    .update(invite)
    .eq("id", invite.id)
    .select()
    .single();
  if (error) {
    return failure(error.message);
  }
  return success(data);
}

export async function deactivateByLeagueId(
  leagueId: string
): Promise<Result<Invite>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.INVITES)
    .update({ status: "expired" })
    .eq("league_id", leagueId)
    .eq("invite_type", "general")
    .eq("status", "pending")
    .select()
    .single();

  if (error) {
    return failure(error.message);
  }
  return success(data);
}

// ============== DELETE ==============
export async function deleteById(inviteId: string): Promise<Result<boolean>> {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.INVITES)
    .delete()
    .eq("id", inviteId);

  if (error) {
    return failure(error.message);
  }
  return success(true);
}
