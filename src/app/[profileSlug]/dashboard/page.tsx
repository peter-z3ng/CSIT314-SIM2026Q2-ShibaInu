import { redirect } from "next/navigation";
import { DashboardBoundary } from "@/boundary/DashboardBoundary";
import { DoneeDashboardBoundary } from "@/boundary/DoneeDashboardBoundary";
import { AuthController } from "@/controller/AuthController";
import { DoneeController } from "@/controller/DoneeController";
import { FundraiserHomePage } from "@/boundary/FundraiserHomePage";
import { FundraiserController } from "@/controller/FundraiserController";

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

  if (account.profile.profile.toLowerCase() !== "admin") {
    return <DashboardBoundary account={account} />;
  }

  if (account.profile.profile.toLowerCase() === "admin") {
    redirect(`/${profileSlug}/account`);
  }
}
