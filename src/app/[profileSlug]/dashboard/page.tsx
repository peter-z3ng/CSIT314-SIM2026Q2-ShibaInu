import { DashboardBoundary } from "@/boundary/DashboardBoundary";
import { DoneeDashboardBoundary } from "@/boundary/DoneeDashboardBoundary";
import { FundraiserHomePage } from "@/boundary/FundraiserHomePage";
import { AuthController } from "@/controller/AuthController";
import { DoneeController } from "@/controller/DoneeController";
import { FundraiserController } from "@/controller/FundraiserController";
import { FRACategoryController } from "@/controller/FRACategoryController";
import { isAdminProfile, profileToPath } from "@/entity/UserProfile";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardRoutePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;

  const authController = new AuthController();
  const account = await authController.requireProfilePath(profileSlug);
  const profileName = account.profile.profile.toLowerCase();

  if (isAdminProfile(account.profile)) {
    redirect(`/${profileToPath(account.profile)}/account`);
  }

  if (profileName === "donee") {
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

  const isFundraiser =
    profileName === "fundraiser" || profileName === "fund raiser";

  if (!isFundraiser) {
    return <DashboardBoundary account={account} />;
  }

  const fundraiserController = new FundraiserController();
  const categoryController = new FRACategoryController();

  const [fraList, categoryList, recentDonations] = await Promise.all([
    fundraiserController.listMyFRAs(account.userId),
    categoryController.listCategories(),
    fundraiserController.listRecentDonations(account.userId),
  ]);

  return (
    <FundraiserHomePage
      account={account.toDTO()}
      fraList={fraList.map((fra) => fra.toDTO())}
      categoryList={categoryList}
      recentDonations={recentDonations}
    />
  );
}