import { AuthController } from "@/controller/AuthController";
import { ViewCategoryController } from "@/controller/ViewCategoryController";
import { DeleteCategoryController } from "@/controller/DeleteCategoryController";
import { ViewCategoryPage } from "@/boundary/ViewCategoryPage";
import { redirect } from "next/navigation";

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

  async function deleteCategoryAction(formData: FormData) {
    "use server";

    const controller = new DeleteCategoryController();

    await controller.deleteCategory(String(formData.get("categoryId")));

    return { success: true };
  }

  return (
    <ViewCategoryPage
      account={account.toDTO()}
      categories={categories}
      deleteCategoryAction={deleteCategoryAction}
    />
  );
}
