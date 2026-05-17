import { UserProfile } from "@/entity/UserProfile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ProfileRow = {
  profile_id: string;
  profile: string;
  status: "active" | "suspended";
};

type AccountRow = {
  user_id: string;
};

// SuspendUserProfileController
export class SuspendUserProfileController {
  // suspendUserProfile(...)
  async suspendUserProfile(profile_id: string): Promise<boolean> {
    const profile = await this.getUserProfile(profile_id);
    const assignedAccountCount = await this.countAssignedAccounts(profile_id);

    if (assignedAccountCount > 0) {
      throw new Error("Can't suspend profile with assigned account.");
    }

    if (!profile.suspendUserProfile(profile_id)) {
      throw new Error("Profile cannot be suspended.");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_profile")
      .update({ status: "suspended" })
      .eq("profile_id", profile_id)
      .select("profile_id, profile, status")
      .limit(1)
      .overrideTypes<ProfileRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return Boolean(data[0]);
  }

  private async getUserProfile(profile_id: string) {
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

  private async countAssignedAccounts(profile_id: string) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_account")
      .select("user_id")
      .eq("profile_id", profile_id)
      .overrideTypes<AccountRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return data.length;
  }
}
