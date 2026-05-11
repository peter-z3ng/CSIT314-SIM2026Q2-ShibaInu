import { CreateFRAPage } from "@/boundary/CreateFRAPage";
import { AuthController } from "@/controller/AuthController";

export const dynamic = "force-dynamic";

export default async function CreateFRARoutePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;

  const authController = new AuthController();

  const account = await authController.requireProfilePath(
    profileSlug,
  );

  return (
    <CreateFRAPage
      account={account.toDTO()}
    />
  );
}