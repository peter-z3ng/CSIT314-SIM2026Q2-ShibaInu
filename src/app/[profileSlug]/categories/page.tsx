import { AuthController } from "@/controller/AuthController";
import { RetrieveFRACategoryController } from "@/platform_management/controller/RetrieveFRACategoryController";
import { DeleteCategoryController } from "@/controller/DeleteCategoryController";
import { RetrieveFRACategoryPage } from "@/platform_management/boundary/RetrieveFRACategoryPage";

export const dynamic = "force-dynamic";

export default async function RetrieveFRACategoryRoutePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;

  const authController = new AuthController();
  const account = await authController.requireProfilePath(profileSlug);

  const retrieveFRACategoryController = new RetrieveFRACategoryController();
  const categories = await retrieveFRACategoryController.retrieveCategories();

  async function deleteCategoryAction(formData: FormData) {
    "use server";

    const controller = new DeleteCategoryController();

    await controller.deleteCategory(String(formData.get("categoryId")));

    return { success: true };
  }

  return (
    <RetrieveFRACategoryPage
      account={account.toDTO()}
      categories={categories}
      deleteCategoryAction={deleteCategoryAction}
    />
  );
}
