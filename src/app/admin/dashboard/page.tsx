import { AdminDashboardBoundary } from "@/boundary/AdminDashboardBoundary";
import { DashboardBoundary } from "@/boundary/DashboardBoundary";
import { AdminController } from "@/controller/AdminController";
import { AuthController } from "@/controller/AuthController";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const profile = await AuthController.requireRole("admin");
  const requests = await AdminController.listPendingRegistrationRequests();

  return (
    <DashboardBoundary role="admin" profile={profile}>
      <AdminDashboardBoundary profile={profile} requests={requests} />
    </DashboardBoundary>
  );
}
