import { redirect } from "next/navigation";
import { GenerateMonthlyReportPage } from "@/platform_management/boundary/GenerateMonthlyReportPage";
import { GenerateMonthlyReportController } from "@/platform_management/controller/GenerateMonthlyReportController";
import { AuthController } from "@/controller/AuthController";
import { profileToPath } from "@/entity/UserProfile";

export const dynamic = "force-dynamic";

export default async function MonthlyReportsRoutePage({
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

  const reportController = new GenerateMonthlyReportController();
  const monthlyReport = await reportController.getMonthlyReport();

  return (
    <GenerateMonthlyReportPage
      account={account.toDTO()}
      monthlyReport={monthlyReport}
    />
  );
}
