import { UserAccount, type Report } from "@/entity/UserAccount";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type UserCreatedAtRow = {
  created_at: string;
  status: "active" | "pending" | "suspended";
};

// GenerateDailyReportController
export class GenerateDailyReportController {
  // getDailyReport()
  async getDailyReport(): Promise<Report[]> {
    const supabase = createSupabaseAdminClient();

    const { data: users, error } = await supabase
      .from("user_account")
      .select("created_at, status")
      .order("created_at", { ascending: true })
      .overrideTypes<UserCreatedAtRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const report = buildDailyPeriods().map((period) => {
      const periodStart = period.start.getTime();
      const periodEnd = period.end.getTime();
      const usersCreatedByPeriod = users.filter(
        (user) => new Date(user.created_at).getTime() <= periodEnd,
      );

      const newUsers = users.filter((user) => {
        const createdAt = new Date(user.created_at).getTime();
        return createdAt >= periodStart && createdAt <= periodEnd;
      }).length;

      return {
        period: period.label,
        startDate: period.start.toISOString(),
        endDate: period.end.toISOString(),
        totalUsers: usersCreatedByPeriod.length,
        newUsers,
        activeUsers: usersCreatedByPeriod.filter((user) => user.status === "active").length,
        suspendedUsers: usersCreatedByPeriod.filter((user) => user.status === "suspended").length,
        pendingUsers: usersCreatedByPeriod.filter((user) => user.status === "pending").length,
      };
    });

    return UserAccount.getDailyReport(report);
  }
}

function buildDailyPeriods() {
  const now = new Date();
  const count = 7;

  return Array.from({ length: count }, (_, index) => {
    const offset = count - index - 1;
    const start = startOfDay(addDays(now, -offset));
    const end = endOfDay(start);

    return {
      label: formatDateLabel(start),
      start,
      end,
    };
  });
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
