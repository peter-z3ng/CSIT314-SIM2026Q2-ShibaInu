import { AdminDashboardBoundary } from "@/boundary/AdminDashboardBoundary";
import { DashboardBoundary } from "@/boundary/DashboardBoundary";
import { AdminController } from "@/controller/AdminController";
import { AuthController } from "@/controller/AuthController";

export const dynamic = "force-dynamic";

export default async function ProfileDashboardPage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;
  const authController = new AuthController();
  const account = await authController.requireProfilePath(profileSlug);

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
