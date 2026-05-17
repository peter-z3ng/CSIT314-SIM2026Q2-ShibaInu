import { UserAccount, type Report } from "@/entity/UserAccount";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type UserCreatedAtRow = {
  created_at: string;
  status: "active" | "pending" | "suspended";
};

// GenerateMonthlyReportController
export class GenerateMonthlyReportController {
  // getMonthlyReport()
  async getMonthlyReport(): Promise<Report[]> {
    const supabase = createSupabaseAdminClient();

    const { data: users, error } = await supabase
      .from("user_account")
      .select("created_at, status")
      .order("created_at", { ascending: true })
      .overrideTypes<UserCreatedAtRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const report = buildMonthlyPeriods().map((period) => {
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

    return UserAccount.getMonthlyReport(report);
  }
}

function buildMonthlyPeriods() {
  const now = new Date();
  const count = 6;

  return Array.from({ length: count }, (_, index) => {
    const offset = count - index - 1;
    const start = startOfMonth(addMonths(now, -offset));
    const end = endOfMonth(start);

    return {
      label: `${formatDateLabel(start)} - ${formatDateLabel(end)}`,
      start,
      end,
    };
  });
}

function addMonths(date: Date, months: number) {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function startOfMonth(date: Date) {
  const copy = new Date(date);
  copy.setDate(1);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfMonth(date: Date) {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + 1, 0);
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
