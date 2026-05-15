import { redirect } from "next/navigation";
import { DashboardBoundary } from "@/boundary/DashboardBoundary";
import { DoneeDashboardBoundary } from "@/boundary/DoneeDashboardBoundary";
import { PlatformManagementHomePage } from "@/boundary/PlatformManagementHomePage";
import { AuthController } from "@/controller/AuthController";
import { DoneeController } from "@/controller/DoneeController";
import { FundraiserHomePage } from "@/boundary/FundraiserHomePage";
import { FundraiserController } from "@/controller/FundraiserController";
import { PlatformManagementController } from "@/controller/PlatformManagementController";

export const dynamic = "force-dynamic";

export default async function ProfileDashboardPage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;
  const authController = new AuthController();
  const account = await authController.requireProfilePath(profileSlug);

  if (account.profile.profile.toLowerCase() === "donee") {
    const doneeController = new DoneeController();
    const [totalDonated, fraList] = await Promise.all([
      doneeController.getTotalDonated(account.userId),
      doneeController.listFRA(),
    ]);

    return (
      <DoneeDashboardBoundary
        account={account.toDTO()}
        totalDonated={totalDonated}
        fraList={fraList.map((fra) => fra.toDTO())}
      />
    );
  }

  if (
    account.profile.profile.toLowerCase() === "fundraiser" ||
    account.profile.profile.toLowerCase() === "fund raiser"
  ) {
    const fundraiserController = new FundraiserController();

    const fraList = await fundraiserController.listMyFRAs(account.userId);

    return (
      <FundraiserHomePage
        account={account.toDTO()}
        fraList={fraList.map((fra) => fra.toDTO())}
      />
    );
  }

    if (account.profile.profile.toLowerCase() === "platform management") {
    const platformManagementController = new PlatformManagementController();

    const [categories, totalUsers] = await Promise.all([
      platformManagementController.listCategories(),
      platformManagementController.getTotalUsers(),
    ]);

    return (
      <PlatformManagementHomePage
        account={account.toDTO()}
        categories={categories}
        totalUsers={totalUsers}
      />
    );
  }

  if (account.profile.profile.toLowerCase() !== "admin") {
    return <DashboardBoundary account={account} />;
  }

  if (account.profile.profile.toLowerCase() === "admin") {
    redirect(`/${profileSlug}/account`);
  }


}
