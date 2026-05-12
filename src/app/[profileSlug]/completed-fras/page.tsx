import { CompletedFRAPage } from "@/boundary/CompletedFRAPage";
import { AuthController } from "@/controller/AuthController";
import { CompletedFRAController } from "@/controller/CompletedFRAController";

export const dynamic = "force-dynamic";

export default async function CompletedFRARoutePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;

  const authController = new AuthController();
  const account = await authController.requireProfilePath(profileSlug);

  const completedFRAController = new CompletedFRAController();

  const fraList = await completedFRAController.listCompletedFRAs(
    account.userId,
  );

  return (
    <CompletedFRAPage
      account={account.toDTO()}
      fraList={fraList.map((fra) => fra.toDTO())}
    />
  );
}