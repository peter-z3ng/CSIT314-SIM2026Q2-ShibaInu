import { UserProfile, type Profile } from "@/entity/UserProfile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ProfileRow = {
  profile_id: string;
  profile: string;
  status: "active" | "suspended";
};

type UserAccountProfileRow = {
  profile: ProfileRow | null;
};

type UserAccountProfileIdRow = {
  profile_id: string | null;
};

// ViewUserProfileController
export class ViewUserProfileController {
  // viewUserProfile(...)
  async viewUserProfile(user_id: string): Promise<UserProfile> {
    if (!user_id.trim()) {
      throw new Error("User id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_account")
      .select("profile:user_profile(profile_id, profile, status)")
      .eq("user_id", user_id)
      .limit(1)
      .overrideTypes<UserAccountProfileRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const profile = data[0]?.profile;

    if (!profile) {
      throw new Error("Profile was not found.");
    }

    return mapProfile(profile).viewUserProfile(user_id);
  }

  async listUserProfiles(): Promise<Profile[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_profile")
      .select("profile_id, profile, status")
      .order("profile", { ascending: true })
      .overrideTypes<ProfileRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map(mapProfile);
  }

  async countUserAccountsByProfile(): Promise<Record<string, number>> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_account")
      .select("profile_id")
      .overrideTypes<UserAccountProfileIdRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return data.reduce<Record<string, number>>((counts, account) => {
      if (!account.profile_id) {
        return counts;
      }

      counts[account.profile_id] = (counts[account.profile_id] ?? 0) + 1;
      return counts;
    }, {});
  }
}

function mapProfile(profile: ProfileRow) {
  return new UserProfile(profile.profile_id, profile.profile, profile.status);
}
