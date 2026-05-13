import { UpdateFRAPage } from "@/boundary/UpdateFRAPage";
import { AuthController } from "@/controller/AuthController";
import { RetrieveFRAController } from "@/controller/RetrieveFRAController";

export const dynamic = "force-dynamic";

export default async function UpdateFRARoutePage({
  params,
}: {
  params: Promise<{
    profileSlug: string;
    fraId: string;
  }>;
}) {
  const { profileSlug, fraId } = await params;

  const authController = new AuthController();

  const account = await authController.requireProfilePath(
    profileSlug,
  );

  const retrieveFRAController = new RetrieveFRAController();

  const fra = await retrieveFRAController.retrieveFRA(
    fraId,
    account.userId,
  );

  return (
    <UpdateFRAPage
      account={account.toDTO()}
      fra={fra.toDTO()}
    />
  );
}