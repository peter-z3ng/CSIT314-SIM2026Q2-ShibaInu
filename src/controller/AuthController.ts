import { redirect } from "next/navigation";
import { isAdminProfile, profileToPath, type Profile, type UserAccount } from "@/entity/Profile";
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

export class AuthController {
  static async getCurrentAccount(): Promise<UserAccount | null> {
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

  static async requireProfilePath(profilePath: string) {
    const account = await AuthController.getCurrentAccount();

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

  static async requireAdmin() {
    const account = await AuthController.getCurrentAccount();

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

function mapUserAccountRow(row: UserAccountRow): UserAccount {
  return {
    userId: row.user_id,
    username: row.username,
    email: row.email,
    status: row.status,
    profile: {
      profileId: row.profile.profile_id,
      profile: row.profile.profile,
    },
  };
}
