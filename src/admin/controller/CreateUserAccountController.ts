import { UserAccount } from "@/entity/UserAccount";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type DuplicateEmailRow = {
  user_id: string;
};

// CreateUserAccountController
export class CreateUserAccountController {
  // createUserAccount(...)
  async createUserAccount(
    username: string,
    email: string,
    password: string,
    profileId: string,
  ) {
    const validatedInput = this.validateInput(username, email, password, profileId);
    const userAccount = UserAccount.createUserAccount({
      username: validatedInput.username,
      email: validatedInput.email,
      password: validatedInput.password,
    });

    const isDuplicateEmail = await this.checkDuplicateEmail(userAccount.email);

    if (isDuplicateEmail) {
      throw new Error("Email is already used.");
    }

    const supabase = createSupabaseAdminClient();
    const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
      email: userAccount.email,
      password: userAccount.password,
      email_confirm: true,
      user_metadata: {
        username: userAccount.username,
        profile_id: validatedInput.profileId,
      },
    });

    if (createError || !createdUser.user) {
      throw new Error(createError?.message ?? "Unable to create user account.");
    }

    const { error: accountError } = await supabase.from("user_account").insert({
      user_id: createdUser.user.id,
      username: userAccount.username,
      email: userAccount.email,
      profile_id: validatedInput.profileId,
      status: "active",
    });

    if (accountError) {
      await supabase.auth.admin.deleteUser(createdUser.user.id);
      throw new Error(accountError.message);
    }
  }

  // validateInput(...)
  validateInput(
    username: string,
    email: string,
    password: string,
    profileId: string,
  ) {
    const trimmedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedProfileId = profileId.trim();

    if (!trimmedUsername) {
      throw new Error("Username is required.");
    }

    if (trimmedUsername.length > 50) {
      throw new Error("Username must be 50 characters or fewer.");
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      throw new Error("Enter a valid email address.");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    if (!trimmedProfileId) {
      throw new Error("Profile is required.");
    }

    return {
      username: trimmedUsername,
      email: normalizedEmail,
      password,
      profileId: trimmedProfileId,
    };
  }

  // checkDuplicateEmail(...)
  async checkDuplicateEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
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
