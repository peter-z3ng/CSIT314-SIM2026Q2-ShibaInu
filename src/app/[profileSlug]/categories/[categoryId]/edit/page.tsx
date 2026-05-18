import { revalidatePath } from "next/cache";
import { AuthController } from "@/controller/AuthController";
import { UpdateFRACategoryController } from "@/platform_management/controller/UpdateFRACategoryController";
import { UpdateFRACategoryPage } from "@/platform_management/boundary/UpdateFRACategoryPage";

export const dynamic = "force-dynamic";

export default async function UpdateCategoryRoutePage({
  params,
}: {
  params: Promise<{
    profileSlug: string;
    categoryId: string;
  }>;
}) {
  const { profileSlug, categoryId } = await params;

  const authController = new AuthController();
  const account = await authController.requireProfilePath(profileSlug);

  const categoryController = new UpdateFRACategoryController();

  const category = await categoryController.getCategoryById(categoryId);

  async function updateCategoryAction(formData: FormData) {
    "use server";

    const controller = new UpdateFRACategoryController({
      categoryName: String(formData.get("categoryName")),
      description: String(formData.get("description")),
    });

    await controller.updateCategory(String(formData.get("categoryId")));

    revalidatePath(`/${profileSlug}/categories`);
  }

  return (
    <UpdateFRACategoryPage
      account={account.toDTO()}
      category={category}
      updateCategoryAction={updateCategoryAction}
    />
  );
}
