import { AuthController } from "@/controller/AuthController";
import { ViewCategoryController } from "@/controller/ViewCategoryController";
import { ViewCategoryPage } from "@/boundary/ViewCategoryPage";

export const dynamic = "force-dynamic";

export default async function ViewCategoryRoutePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;

  const authController = new AuthController();
  const account = await authController.requireProfilePath(profileSlug);

  const viewCategoryController = new ViewCategoryController();
  const categories = await viewCategoryController.viewCategories();

  return (
    <ViewCategoryPage
      account={account.toDTO()}
      categories={categories}
    />
  );
}