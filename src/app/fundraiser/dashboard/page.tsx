import { DashboardBoundary } from "@/boundary/DashboardBoundary";
import { AuthController } from "@/controller/AuthController";

export const dynamic = "force-dynamic";

export default async function FundraiserDashboardPage() {
  const profile = await AuthController.requireRole("fundraiser");
  return <DashboardBoundary role="fundraiser" profile={profile} />;
}
