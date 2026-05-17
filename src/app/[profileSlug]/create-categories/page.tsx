import { AuthController } from "@/controller/AuthController";
import { CreateFRACategoryPage } from "@/platform_management/boundary/CreateFRACategoryPage";

export const dynamic = "force-dynamic";

export default async function CreateFRACategoryRoutePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;

  const authController = new AuthController();
  const account = await authController.requireProfilePath(profileSlug);

  return <CreateFRACategoryPage account={account.toDTO()} />;
}
