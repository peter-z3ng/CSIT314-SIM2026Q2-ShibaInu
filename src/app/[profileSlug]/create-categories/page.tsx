import { AuthController } from "@/controller/AuthController";
import { CreateFRACategoryPage } from "@/platform_management/boundary/CreateFRACategoryPage";

export const dynamic = "force-dynamic";

export default async function CreateFRACategoryRoutePage({
  params,
  searchParams,
}: {
  params: Promise<{ profileSlug: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { profileSlug } = await params;
  const { success, error } = await searchParams;

  const authController = new AuthController();
  const account = await authController.requireProfilePath(profileSlug);

  return (
    <CreateFRACategoryPage
      account={account.toDTO()}
      successMessage={success === "created" ? "Category created successfully." : ""}
      errorMessage={error ?? ""}
    />
  );
}
