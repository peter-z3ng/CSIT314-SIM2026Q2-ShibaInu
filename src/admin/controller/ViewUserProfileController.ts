import { UserProfile, type Profile } from "@/entity/UserProfile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ProfileRow = {
  profile_id: string;
  profile: string;
};

type UserAccountProfileRow = {
  profile: ProfileRow | null;
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
      .select("profile:user_profile(profile_id, profile)")
      .eq("user_id", user_id)
      .limit(1)
      .overrideTypes<UserAccountProfileRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const profile = data[0]?.profile;

    if (!profile) {
      throw new Error("User profile was not found.");
    }

    return mapProfile(profile).viewUserProfile(user_id);
  }

  async listUserProfiles(): Promise<Profile[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_profile")
      .select("profile_id, profile")
      .order("profile", { ascending: true })
      .overrideTypes<ProfileRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map(mapProfile);
  }
}

function mapProfile(profile: ProfileRow) {
  return new UserProfile(profile.profile_id, profile.profile);
}
