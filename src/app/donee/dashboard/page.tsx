import { DashboardBoundary } from "@/boundary/DashboardBoundary";
import { AuthController } from "@/controller/AuthController";

export const dynamic = "force-dynamic";

export default async function DoneeDashboardPage() {
  const profile = await AuthController.requireRole("donee");
  return <DashboardBoundary role="donee" profile={profile} />;
}
