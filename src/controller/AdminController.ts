import type { Profile, UserAccount } from "@/entity/Profile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ProfileRow = {
  profile_id: string;
  profile: string;
};

type UserAccountRow = {
  user_id: string;
  username: string;
  email: string;
  status: UserAccount["status"];
  profile: ProfileRow;
};

export class AdminController {
  static async listProfiles(): Promise<Profile[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_profile")
      .select("profile_id, profile")
      .order("profile", { ascending: true })
      .returns<ProfileRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map(mapProfile);
  }

  static async listPendingUserAccounts(): Promise<UserAccount[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_account")
      .select("user_id, username, email, status, profile:user_profile(profile_id, profile)")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .returns<UserAccountRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map((account) => ({
      userId: account.user_id,
      username: account.username,
      email: account.email,
      status: account.status,
      profile: mapProfile(account.profile),
    }));
  }
}

function mapProfile(profile: ProfileRow): Profile {
  return {
    profileId: profile.profile_id,
    profile: profile.profile,
  };
}
