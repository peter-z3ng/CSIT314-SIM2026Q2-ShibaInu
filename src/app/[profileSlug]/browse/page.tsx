import { redirect } from "next/navigation";
import { DoneePageBoundary } from "@/boundary/DoneePageBoundary";
import { AuthController } from "@/controller/AuthController";
import { RouteController } from "@/controller/RouteController";

export const dynamic = "force-dynamic";

export default async function DoneeBrowsePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;
  const account = await new AuthController().requireProfilePath(profileSlug);

  if (account.profile.profile.toLowerCase() !== "donee") {
    redirect(RouteController.getDashboardPath(account.profile));
  }

  return <DoneePageBoundary account={account.toDTO()} title="Browse" />;
}
