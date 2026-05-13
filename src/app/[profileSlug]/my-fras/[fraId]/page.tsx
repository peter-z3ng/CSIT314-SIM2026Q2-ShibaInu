import { RetrieveFRAPage } from "@/boundary/RetrieveFRAPage";
import { AuthController } from "@/controller/AuthController";
import { RetrieveFRAController } from "@/controller/RetrieveFRAController";

export const dynamic = "force-dynamic";

export default async function RetrieveFRARoutePage({
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
    <RetrieveFRAPage
      account={account.toDTO()}
      fra={fra.toDTO()}
    />
  );
}