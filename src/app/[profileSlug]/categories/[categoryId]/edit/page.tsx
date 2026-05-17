import { revalidatePath } from "next/cache";
import { AuthController } from "@/controller/AuthController";
import { UpdateCategoryController } from "@/controller/UpdateCategoryController";
import { UpdateCategoryPage } from "@/boundary/UpdateCategoryPage";

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

  const categoryController = new UpdateCategoryController();

  const category = await categoryController.getCategoryById(categoryId);

  async function updateCategoryAction(formData: FormData) {
    "use server";

    const controller = new UpdateCategoryController();

    await controller.updateCategory({
      categoryId: String(formData.get("categoryId")),
      categoryName: String(formData.get("categoryName")),
      description: String(formData.get("description")),
    });

    revalidatePath(`/${profileSlug}/categories`);
  }

  return (
    <UpdateCategoryPage
      account={account.toDTO()}
      category={category}
      updateCategoryAction={updateCategoryAction}
    />
  );
}
