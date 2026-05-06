import { UserAccount } from "@/entity/UserAccount";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CreateUserAccountInput = {
  username: string;
  email: string;
  password: string;
  profileId: string;
};

export class CreateUserAccount {
  async createByAdmin(input: CreateUserAccountInput) {
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

  async approvePendingAccount(userId: string) {
    if (!userId.trim()) {
      throw new Error("User id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("user_account")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
