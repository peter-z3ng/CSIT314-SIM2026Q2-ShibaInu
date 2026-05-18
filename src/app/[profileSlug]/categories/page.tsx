import { AuthController } from "@/controller/AuthController";
import { RetrieveFRACategoryController } from "@/platform_management/controller/RetrieveFRACategoryController";
import { DeleteFRACategoryController } from "@/platform_management/controller/DeleteFRACategoryController";
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

  async function deleteFRACategoryAction(formData: FormData) {
    "use server";

    try {
      const controller = new DeleteFRACategoryController();

      await controller.deleteFRACategory(String(formData.get("categoryId")));

      return { success: true, message: "Category deleted successfully." };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unable to delete category.",
      };
    }
  }

  return (
    <RetrieveFRACategoryPage
      account={account.toDTO()}
      categories={categories}
      deleteFRACategoryAction={deleteFRACategoryAction}
    />
  );
}
