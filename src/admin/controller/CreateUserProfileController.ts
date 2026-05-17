import { UserProfile } from "@/entity/UserProfile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ProfileRow = {
  profile_id: string;
  profile: string;
  status: "active" | "suspended";
};

// CreateUserProfileController
export class CreateUserProfileController {
  // createUserProfile(...)
  async createUserProfile(profile: string): Promise<boolean> {
    const profileName = UserProfile.createNew(profile);
    const supabase = createSupabaseAdminClient();

    const { data: existingProfiles, error: duplicateError } = await supabase
      .from("user_profile")
      .select("profile_id, profile, status")
      .ilike("profile", profileName)
      .limit(1)
      .overrideTypes<ProfileRow[], { merge: false }>();

    if (duplicateError) {
      throw new Error(duplicateError.message);
    }

    if (existingProfiles[0]) {
      throw new Error("Profile already exists.");
    }

    const { data, error } = await supabase
      .from("user_profile")
      .insert({ profile: profileName, status: "active" })
      .select("profile_id, profile, status")
      .limit(1)
      .overrideTypes<ProfileRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return Boolean(data[0]);
  }
}
