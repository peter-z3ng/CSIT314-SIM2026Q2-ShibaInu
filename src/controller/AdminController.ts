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

export class AdminController {
  async createUserAccount(input: {
    username: string;
    email: string;
    password: string;
    profileId: string;
  }) {
    const username = input.username.trim();
    const email = UserAccount.normalizeEmail(input.email);

    UserAccount.validateUsername(username);
    UserAccount.validatePassword(input.password);

    if (!input.profileId.trim()) {
      throw new Error("Profile is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        username,
        profile_id: input.profileId,
      },
    });

    if (createError || !createdUser.user) {
      throw new Error(createError?.message ?? "Unable to create user account.");
    }

    const { error: accountError } = await supabase.from("user_account").insert({
      user_id: createdUser.user.id,
      username,
      email,
      profile_id: input.profileId,
      status: "active",
    });

    if (accountError) {
      await supabase.auth.admin.deleteUser(createdUser.user.id);
      throw new Error(accountError.message);
    }
  }

  async createProfile(name: string) {
    const profile = UserProfile.createNew(name);
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("user_profile").insert({
      profile,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async approveUserAccount(userId: string) {
    await this.updateUserAccountStatus(userId, "active");
  }

  async suspendUserAccount(userId: string) {
    await this.updateUserAccountStatus(userId, "suspended");
  }

  async listProfiles(): Promise<Profile[]> {
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

  async listPendingUserAccounts(): Promise<UserAccount[]> {
    const accounts = await this.listUserAccounts();
    return accounts.filter((account) => account.status === "pending");
  }

  async listActiveUserAccounts(): Promise<UserAccount[]> {
    const accounts = await this.listUserAccounts();
    return accounts.filter((account) => account.status === "active");
  }

  async listUserAccounts(): Promise<UserAccount[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_account")
      .select("user_id, username, email, status, profile:user_profile(profile_id, profile)")
      .order("created_at", { ascending: true })
      .returns<UserAccountRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map((account) => new UserAccount({
      userId: account.user_id,
      username: account.username,
      email: account.email,
      status: account.status,
      profile: mapProfile(account.profile),
    }));
  }

  private async updateUserAccountStatus(userId: string, status: UserAccount["status"]) {
    if (!userId.trim()) {
      throw new Error("User id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("user_account")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }
  }
}

function mapProfile(profile: ProfileRow): Profile {
  return new UserProfile(profile.profile_id, profile.profile);
}
