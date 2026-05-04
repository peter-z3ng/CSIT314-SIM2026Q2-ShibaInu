import { AdminDashboardBoundary } from "@/boundary/AdminDashboardBoundary";
import { DashboardBoundary } from "@/boundary/DashboardBoundary";
import { DoneeDashboardBoundary } from "@/boundary/DoneeDashboardBoundary";
import { AdminController } from "@/controller/AdminController";
import { AuthController } from "@/controller/AuthController";
import { DoneeController } from "@/controller/DoneeController";

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

  if (account.profile.profile.toLowerCase() !== "admin") {
    return <DashboardBoundary account={account} />;
  }

  const adminController = new AdminController();
  const userAccounts = await adminController.listUserAccounts();

  return <AdminDashboardBoundary
    account={account.toDTO()}
    userAccounts={userAccounts.map((userAccount) => userAccount.toDTO())}
  />;
}
