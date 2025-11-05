import { createClient } from "@/lib/database/server";
import { TABLES } from "@/lib/database/tables";
import { Result, success, failure } from "@/lib/types";
import { RealTeams } from "@/lib/types/database_types";

export async function findAll() : Promise<Result<RealTeams[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from(TABLES.REAL_TEAMS).select('*');
    if (error) {
        return failure(error.message);
    }
    return success(data);
}