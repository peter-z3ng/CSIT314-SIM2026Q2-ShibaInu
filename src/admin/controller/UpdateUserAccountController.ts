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

// UpdateUserAccountController
export class UpdateUserAccountController {
  // updateUserAccount(...)
  async updateUserAccount(input: {
    userId: string;
    username: string;
    email: string;
  }): Promise<boolean> {
    const currentAccount = await this.getCurrentAccount(input.userId);

    if (!currentAccount.updateUserAccount(input.userId, input.username)) {
      throw new Error("User account details do not match the requested user.");
    }

    const updatedAccount = currentAccount.updateUserAccountDetails({
      username: input.username,
      email: input.email,
    });

    const supabase = createSupabaseAdminClient();

    if (updatedAccount.email !== currentAccount.email) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        updatedAccount.userId,
        {
          email: updatedAccount.email,
          email_confirm: true,
        },
      );

      if (authError) {
        throw new Error(authError.message);
      }
    }

    const { data, error } = await supabase
      .from("user_account")
      .update({
        username: updatedAccount.username,
        email: updatedAccount.email,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", updatedAccount.userId)
      .select("user_id, username, email, status, profile:user_profile(profile_id, profile)")
      .limit(1)
      .overrideTypes<UserAccountRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return Boolean(data[0]);
  }

  private async getCurrentAccount(userId: string): Promise<UserAccount> {
    if (!userId.trim()) {
      throw new Error("User id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_account")
      .select("user_id, username, email, status, profile:user_profile(profile_id, profile)")
      .eq("user_id", userId)
      .limit(1)
      .overrideTypes<UserAccountRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const account = data[0];

    if (!account) {
      throw new Error("User account was not found.");
    }

    return mapUserAccount(account);
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

function mapProfile(profile: ProfileRow | null): Profile {
  if (!profile) {
    return new UserProfile("missing-profile", "Missing Profile");
  }

  return new UserProfile(profile.profile_id, profile.profile);
}
