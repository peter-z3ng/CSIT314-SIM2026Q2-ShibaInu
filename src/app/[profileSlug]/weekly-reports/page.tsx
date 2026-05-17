import { redirect } from "next/navigation";
import { GenerateWeeklyReportPage } from "@/platform_management/boundary/GenerateWeeklyReportPage";
import { GenerateWeeklyReportController } from "@/platform_management/controller/GenerateWeeklyReportController";
import { AuthController } from "@/controller/AuthController";
import { profileToPath } from "@/entity/UserProfile";

export const dynamic = "force-dynamic";

export default async function WeeklyReportsRoutePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;

  const authController = new AuthController();
  const account = await authController.requireProfilePath(profileSlug);

  if (account.profile.profile.toLowerCase() !== "platform management") {
    redirect(`/${profileToPath(account.profile)}/dashboard`);
  }

  const reportController = new GenerateWeeklyReportController();
  const weeklyReport = await reportController.getWeeklyReport();

  return (
    <GenerateWeeklyReportPage
      account={account.toDTO()}
      weeklyReport={weeklyReport}
    />
  );
}
