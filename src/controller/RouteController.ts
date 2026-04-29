import type { AccountRole } from "@/entity/UserAccount";

export class RouteController {
  static getDashboardPath(role: AccountRole) {
    return `/${role}/dashboard`;
  }

  static getLogoutPath(role: AccountRole) {
    return `/${role}/logout`;
  }
}
