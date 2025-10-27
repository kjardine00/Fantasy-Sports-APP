import { Profile } from '@/lib/types/database_types';
import { Result } from '@/lib/types';
import { findByAuthId } from "@/lib/database/queries/profiles_queries";

export class ProfileService {
    static async getProfile(userId: string): Promise<Result<Profile>> {
        const result = await findByAuthId(userId);
        
        // With Result<T>, error is always string | null, data is always Profile | null
        if (result.error) {
            return { data: null, error: result.error };
        }
        
        return { data: result.data, error: null };
    }
}