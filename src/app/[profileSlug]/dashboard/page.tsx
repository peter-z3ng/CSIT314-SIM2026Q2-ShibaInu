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
  const account = await AuthController.requireProfilePath(profileSlug);

  if (account.profile.profile.toLowerCase() !== "admin") {
    return <DashboardBoundary account={account} />;
  }

  const [requests, profiles] = await Promise.all([
    AdminController.listPendingRegistrationRequests(),
    AdminController.listProfiles(),
  ]);

  return (
    <DashboardBoundary account={account}>
      <AdminDashboardBoundary account={account} requests={requests} profiles={profiles} />
    </DashboardBoundary>
  );
}
