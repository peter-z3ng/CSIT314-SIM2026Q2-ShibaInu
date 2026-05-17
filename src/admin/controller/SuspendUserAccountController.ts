import { UserAccount } from "@/entity/UserAccount";
import { UserProfile, type Profile } from "@/entity/UserProfile";
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
  profile: ProfileRow | null;
};

// SuspendUserAccountController
export class SuspendUserAccountController {
  // suspendUserAccount(...)
  async suspendUserAccount(user_id: string): Promise<boolean> {
    const userAccount = await this.getUserAccount(user_id);

    if (!userAccount.suspendUserAccount(user_id)) {
      throw new Error("User account cannot be suspended.");
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("user_account")
      .update({ status: "suspended", updated_at: new Date().toISOString() })
      .eq("user_id", user_id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  private async getUserAccount(user_id: string): Promise<UserAccount> {
    if (!user_id.trim()) {
      throw new Error("User id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_account")
      .select("user_id, username, email, status, profile:user_profile(profile_id, profile)")
      .eq("user_id", user_id)
      .limit(1)
      .overrideTypes<UserAccountRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const account = data[0];

    if (!account) {
      throw new Error("User account was not found.");
    }

    return new UserAccount({
      userId: account.user_id,
      username: account.username,
      email: account.email,
      status: account.status,
      profile: mapProfile(account.profile),
    });
  }
}

function mapProfile(profile: ProfileRow | null): Profile {
  if (!profile) {
    return new UserProfile("missing-profile", "Missing Profile");
  }

  return new UserProfile(profile.profile_id, profile.profile);
}
