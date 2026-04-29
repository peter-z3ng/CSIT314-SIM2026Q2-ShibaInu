import { redirect } from "next/navigation";
import type { AccountRole, PublicProfileType, UserProfile } from "@/entity/UserAccount";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { RouteController } from "./RouteController";

export type EmailLookupResult =
  | { status: "existing"; email: string; role: AccountRole }
  | { status: "pending"; email: string }
  | { status: "new"; email: string };

export class AuthController {
  static getDashboardPath(role: AccountRole) {
    return RouteController.getDashboardPath(role);
  }

  static getLogoutPath(role: AccountRole) {
    return RouteController.getLogoutPath(role);
  }

  static async getCurrentProfile() {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, username, email, role")
      .eq("id", user.id)
      .single<UserProfile>();

    if (error || !profile) {
      return null;
    }

    return profile;
  }

  static async requireRole(role: AccountRole) {
    const profile = await AuthController.getCurrentProfile();

    if (!profile) {
      redirect("/login");
    }

    if (profile.role !== role) {
      redirect(AuthController.getDashboardPath(profile.role));
    }

    return profile;
  }

  static isPublicRole(role: string): role is PublicProfileType {
    return role === "donee" || role === "fundraiser" || role === "platform-management";
  }
}
