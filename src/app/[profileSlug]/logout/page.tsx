import { LogoutBoundary } from "@/boundary/LogoutBoundary";
import { AuthController } from "@/controller/AuthController";

export const dynamic = "force-dynamic";

export default async function ProfileLogoutPage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;
  const account = await AuthController.requireProfilePath(profileSlug);

  return <LogoutBoundary profile={account.profile} />;
}
