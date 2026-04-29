import { DashboardBoundary } from "@/boundary/DashboardBoundary";
import { AuthController } from "@/controller/AuthController";

export const dynamic = "force-dynamic";

export default async function PlatformManagementDashboardPage() {
  const profile = await AuthController.requireRole("platform-management");
  return <DashboardBoundary role="platform-management" profile={profile} />;
}
