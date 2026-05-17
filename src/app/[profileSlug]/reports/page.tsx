import { redirect } from "next/navigation";
import { GenerateDailyReportPage } from "@/platform_management/boundary/GenerateDailyReportPage";
import { GenerateDailyReportController } from "@/platform_management/controller/GenerateDailyReportController";
import { AuthController } from "@/controller/AuthController";
import { profileToPath } from "@/entity/UserProfile";

export const dynamic = "force-dynamic";

export default async function ReportsRoutePage({
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

  const reportController = new GenerateDailyReportController();
  const dailyReport = await reportController.getDailyReport();

  return (
    <GenerateDailyReportPage
      account={account.toDTO()}
      dailyReport={dailyReport}
    />
  );
}
