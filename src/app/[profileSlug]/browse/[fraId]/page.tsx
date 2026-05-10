import { redirect } from "next/navigation";
import { FRADetailsPage } from "@/boundary/FRADetailsPage";
import { AuthController } from "@/controller/AuthController";
import { RouteController } from "@/controller/RouteController";
import { ViewFRADetailsController } from "@/controller/ViewFRADetailsController";

export const dynamic = "force-dynamic";

export default async function DoneeFRADetailsRoute({
  params,
}: {
  params: Promise<{ profileSlug: string; fraId: string }>;
}) {
  const { profileSlug, fraId } = await params;
  const account = await new AuthController().requireProfilePath(profileSlug);

  if (account.profile.profile.toLowerCase() !== "donee") {
    redirect(RouteController.getDashboardPath(account.profile));
  }

  const fra = await new ViewFRADetailsController().viewFRADetails(fraId);

  return <FRADetailsPage account={account.toDTO()} fra={fra.toDTO()} />;
}
