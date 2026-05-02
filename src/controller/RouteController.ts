import { profileToPath, type Profile } from "@/entity/UserProfile";

export class RouteController {
  static getDashboardPath(profile: Pick<Profile, "profile">) {
    return `/${profileToPath(profile)}/dashboard`;
  }

  static getLogoutPath(profile: Pick<Profile, "profile">) {
    return `/${profileToPath(profile)}/logout`;
  }
}
