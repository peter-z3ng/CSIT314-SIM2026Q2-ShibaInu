import { revalidatePath } from "next/cache";
import { AuthController } from "@/controller/AuthController";
import { CreateCategoryController } from "@/controller/CreateCategoryController";
import { CreateCategoryPage } from "@/boundary/CreateCategoryPage";

export const dynamic = "force-dynamic";

export default async function CreateCategoryRoutePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;

  const authController = new AuthController();
  const account = await authController.requireProfilePath(profileSlug);

  async function createCategoryAction(formData: FormData) {
    "use server";

    const controller = new CreateCategoryController();

    await controller.createCategory({
      userId: account.userId,
      categoryName: String(formData.get("categoryName")),
      description: String(formData.get("description")),
    });

    revalidatePath(`/${profileSlug}/categories`);
  }

  return (
    <CreateCategoryPage account={account.toDTO()} createCategoryAction={createCategoryAction} />
  );
}
