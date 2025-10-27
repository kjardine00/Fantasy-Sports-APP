import { getProfileByAuthId } from "@/lib/database/queries/profiles_queries";

export class ProfileService {
    static async getProfile(userId: string) {
        const { data, error } = await getProfileByAuthId(userId);
        if (error) {
            return { data: null, error: error.message };
        }
        return { data, error: null };
    }
}