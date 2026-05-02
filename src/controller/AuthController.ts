import { redirect } from "next/navigation";
import { UserAccount } from "@/entity/UserAccount";
import { UserProfile, isAdminProfile, profileToPath, type Profile } from "@/entity/UserProfile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { RouteController } from "./RouteController";

type UserAccountRow = {
  user_id: string;
  username: string;
  email: string;
  status: UserAccount["status"];
  profile: {
    profile_id: string;
    profile: string;
  };
};

export type EmailLookupResult =
  | { status: "existing"; email: string; profile: Profile }
  | { status: "pending"; email: string }
  | { status: "suspended"; email: string }
  | { status: "new"; email: string };

export type ActionResult = {
  ok: boolean;
  message: string;
};

type ProfileRow = {
  profile_id: string;
  profile: string;
};

type AccountLookupRow = {
  email: string;
  status: UserAccount["status"];
  profile: ProfileRow;
};

export class AuthController {
  async listPublicProfiles(): Promise<Profile[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_profile")
      .select("profile_id, profile")
      .neq("profile", "Admin")
      .order("profile", { ascending: true })
      .returns<ProfileRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map(mapProfileRow);
  }

  async lookupEmail(email: string): Promise<EmailLookupResult> {
    const normalizedEmail = UserAccount.normalizeEmail(email);
    const supabase = createSupabaseAdminClient();

    const { data: account, error } = await supabase
      .from("user_account")
      .select("email, status, profile:user_profile(profile_id, profile)")
      .eq("email", normalizedEmail)
      .maybeSingle<AccountLookupRow>();

    if (error) {
      throw new Error(error.message);
    }

    if (!account) {
      return { status: "new", email: normalizedEmail };
    }

    if (account.status === "pending") {
      return { status: "pending", email: normalizedEmail };
    }

    if (account.status === "suspended") {
      return { status: "suspended", email: normalizedEmail };
    }

    return {
      status: "existing",
      email: normalizedEmail,
      profile: mapProfileRow(account.profile),
    };
  }

  async createPendingUserAccount(input: {
    username: string;
    email: string;
    password: string;
    requestedProfileId: string;
  }): Promise<ActionResult> {
    const username = input.username.trim();
    const email = UserAccount.normalizeEmail(input.email);

    try {
      UserAccount.validateUsername(username);
      UserAccount.validatePassword(input.password);
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Invalid account details.",
      };
    }

    if (!input.requestedProfileId) {
      return { ok: false, message: "Select a profile." };
    }

    const existing = await this.lookupEmail(email);

    if (existing.status !== "new") {
      return {
        ok: false,
        message:
          existing.status === "pending"
            ? "Your account is waiting for admin approval."
            : "An account already exists for this email.",
      };
    }

    const supabase = createSupabaseAdminClient();
    const { data: profile, error: profileError } = await supabase
      .from("user_profile")
      .select("profile_id, profile")
      .eq("profile_id", input.requestedProfileId)
      .single<ProfileRow>();

    if (profileError || !profile) {
      return { ok: false, message: profileError?.message ?? "Selected profile was not found." };
    }

    if (new UserProfile(profile.profile_id, profile.profile).isAdmin) {
      return { ok: false, message: "Admin accounts cannot be requested publicly." };
    }

    const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        username,
        profile_id: input.requestedProfileId,
      },
    });

    if (createError || !createdUser.user) {
      return { ok: false, message: createError?.message ?? "Unable to create account." };
    }

    const { error: accountError } = await supabase.from("user_account").insert({
      user_id: createdUser.user.id,
      username,
      email,
      profile_id: input.requestedProfileId,
      status: "pending",
    });

    if (accountError) {
      await supabase.auth.admin.deleteUser(createdUser.user.id);
      return { ok: false, message: accountError.message };
    }

    return { ok: true, message: "Account created and waiting for admin approval." };
  }

  async getCurrentAccount(): Promise<UserAccount | null> {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: account, error } = await supabase
      .from("user_account")
      .select("user_id, username, email, status, profile:user_profile(profile_id, profile)")
      .eq("user_id", user.id)
      .single<UserAccountRow>();

    if (error || !account) {
      return null;
    }

    return mapUserAccountRow(account);
  }

  async requireProfilePath(profilePath: string) {
    const account = await this.getCurrentAccount();

    if (!account) {
      redirect("/login");
    }

    if (account.status !== "active") {
      redirect("/login");
    }

    if (profileToPath(account.profile) !== profilePath) {
      redirect(RouteController.getDashboardPath(account.profile));
    }

    return account;
  }

  async requireAdmin() {
    const account = await this.getCurrentAccount();

    if (!account) {
      redirect("/login");
    }

    if (account.status !== "active") {
      redirect("/login");
    }

    if (!isAdminProfile(account.profile)) {
      redirect(RouteController.getDashboardPath(account.profile));
    }

    return account;
  }
}

function mapProfileRow(row: ProfileRow): Profile {
  return new UserProfile(row.profile_id, row.profile);
}

function mapUserAccountRow(row: UserAccountRow): UserAccount {
  return new UserAccount({
    userId: row.user_id,
    username: row.username,
    email: row.email,
    status: row.status,
    profile: new UserProfile(row.profile.profile_id, row.profile.profile),
  });
}
