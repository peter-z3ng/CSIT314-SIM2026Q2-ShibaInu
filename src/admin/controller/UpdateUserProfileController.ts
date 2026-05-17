import { UserProfile } from "@/entity/UserProfile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ProfileRow = {
  profile_id: string;
  profile: string;
  status: "active" | "suspended";
};

// UpdateUserProfileController
export class UpdateUserProfileController {
  // updateUserProfile(...)
  async updateUserProfile(profile_id: string, profile: string): Promise<boolean> {
    const currentProfile = await this.getUserProfile(profile_id);

    if (!currentProfile.updateUserProfile(profile_id, profile)) {
      throw new Error("Profile details do not match the requested profile.");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_profile")
      .update({ profile: UserProfile.createNew(profile) })
      .eq("profile_id", profile_id)
      .select("profile_id, profile, status")
      .limit(1)
      .overrideTypes<ProfileRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return Boolean(data[0]);
  }

  private async getUserProfile(profile_id: string): Promise<UserProfile> {
    if (!profile_id.trim()) {
      throw new Error("Profile id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_profile")
      .select("profile_id, profile, status")
      .eq("profile_id", profile_id)
      .limit(1)
      .overrideTypes<ProfileRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const profile = data[0];

    if (!profile) {
      throw new Error("Profile was not found.");
    }

    return new UserProfile(profile.profile_id, profile.profile, profile.status);
  }
}
