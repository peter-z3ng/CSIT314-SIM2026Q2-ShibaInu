import { UserAccount } from "@/entity/UserAccount";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type CreateUserAccountInput = {
  username: string;
  email: string;
  password: string;
  profileId: string;
};

type DuplicateEmailRow = {
  user_id: string;
};

export class CreateUserAccountController {
  async createUserAccount(input: CreateUserAccountInput) {
    const userAccount = UserAccount.createUserAccount({
      username: input.username,
      email: input.email,
      password: input.password,
    });

    if (!input.profileId.trim()) {
      throw new Error("Profile is required.");
    }

    const isDuplicateEmail = await this.checkDuplicateEmail(userAccount.email);

    if (isDuplicateEmail) {
      throw new Error("Email is already used by another account.");
    }

    const supabase = createSupabaseAdminClient();
    const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
      email: userAccount.email,
      password: userAccount.password,
      email_confirm: true,
      user_metadata: {
        username: userAccount.username,
        profile_id: input.profileId,
      },
    });

    if (createError || !createdUser.user) {
      throw new Error(createError?.message ?? "Unable to create user account.");
    }

    const { error: accountError } = await supabase.from("user_account").insert({
      user_id: createdUser.user.id,
      username: userAccount.username,
      email: userAccount.email,
      profile_id: input.profileId,
      status: "active",
    });

    if (accountError) {
      await supabase.auth.admin.deleteUser(createdUser.user.id);
      throw new Error(accountError.message);
    }
  }

  async checkDuplicateEmail(email: string) {
    const normalizedEmail = UserAccount.normalizeEmail(email);
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_account")
      .select("user_id")
      .eq("email", normalizedEmail)
      .limit(1)
      .overrideTypes<DuplicateEmailRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return data.length > 0;
  }
}
