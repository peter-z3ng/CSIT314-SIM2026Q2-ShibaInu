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
  profile: ProfileRow;
};

export class ViewUserAccountController {
  async viewUserAccount(user_id: string): Promise<UserAccount> {
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

    return mapUserAccount(account).viewUserAccount(user_id);
  }
}

function mapUserAccount(account: UserAccountRow) {
  return new UserAccount({
    userId: account.user_id,
    username: account.username,
    email: account.email,
    status: account.status,
    profile: mapProfile(account.profile),
  });
}

function mapProfile(profile: ProfileRow): Profile {
  return new UserProfile(profile.profile_id, profile.profile);
}
