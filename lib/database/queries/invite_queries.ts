import { createClient } from "@/lib/database/server";
import { TABLES } from "@/lib/database/tables";
import { Invite } from "@/lib/types/database_types";
import { Result, success, failure } from "@/lib/types";

// Find, Create, Update, Delete, Exists, Count

// ============== FIND ==============
export async function findById(inviteId: string) : Promise<Result<Invite>> {
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

export async function findByLeagueId(leagueId: string) : Promise<Result<Invite[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.INVITES)
    .select("*")
    .eq("league_id", leagueId)
    
  if (error) {
    return failure(error.message);
  }
  // Ensure data is always an array, even if Supabase returns null
  return success(data ?? []);
}

// ============== CREATE ==============
export async function create(invite: Invite) : Promise<Result<Invite>> {
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

// ============== REFACTOR LINE ==============


// TODO: This function should return { data, error } but currently returns void
export async function deleteById(inviteId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.INVITES)
    .delete()
    .eq("id", inviteId);
  
  return { data: null, error };
}

export async function findGenericByLeagueId(leagueId: string) {
  const supabase = await createClient();

  const { data: invite, error } = await supabase
    .from(TABLES.INVITES)
    .select("*")
    .eq("league_id", leagueId)
    .eq("invite_type", "general")
    .eq("status", "pending")
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: invite, error: null };
}

export async function createGeneric(
  leagueId: string,
  invitedBy: string,
  maxUses: number | null
) {
  const supabase = await createClient();

  const genericInvite: Invite = {
    league_id: leagueId,
    email: "", // Empty for generic links
    invited_by: invitedBy,
    status: "pending",
    invite_type: "general",
    max_uses: maxUses,
    current_uses: 0,
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
  };

  const { data: invite, error } = await supabase
    .from(TABLES.INVITES)
    .insert(genericInvite)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: invite, error: null };
}

//TODO: Turn this into an update function that accepts params
export async function deactivateById(leagueId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from(TABLES.INVITES)
    .update({ status: "expired" })
    .eq("league_id", leagueId)
    .eq("invite_type", "general")
    .eq("status", "pending");

  if (error) {
    return { data: null, error };
  }

  return { data: true, error: null };
}

export async function findByToken(token: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLES.INVITES)
    .select("*")
    .eq("token", token)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function updateUsage(inviteId: string, currentUses: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.INVITES)
    .update({
      current_uses: (currentUses || 0) + 1,
      accepted_at: new Date().toISOString(),
      status: "accepted",
    })
    .eq("id", inviteId)
    .select()
    .single();

    return { data, error };
}

export async function updateUsageOnly(inviteId: string, currentUses: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
  .from(TABLES.INVITES)
  .update({
    current_uses: (currentUses || 0) + 1,
  })
  .eq("id", inviteId)
  .select()
  .single();

  return { data, error };
}

export async function membershipExists(leagueId: string, userId: string ) {
  const supabase = await createClient();
  const { data, error } = await supabase
  .from(TABLES.LEAGUES_MEMBERS)
  .select("user_id")
  .eq("league_id", leagueId)
  .eq("user_id", userId)
  .maybeSingle();

  return { exists: !!data, error };
}

//TODO: Turn this into an update function that accepts params
export async function deactivateGenericByLeagueId(leagueId: string) {
  const supabase = await createClient();
  const { error } = await supabase
  .from(TABLES.INVITES)
  .update({ status: "expired" })
  .eq("league_id", leagueId)
  .eq("invite_type", "general")
  .eq("status", "pending");

  return { error };
}
