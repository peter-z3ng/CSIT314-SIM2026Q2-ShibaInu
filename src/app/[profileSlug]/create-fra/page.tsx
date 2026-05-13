import { CreateFRAPage } from "@/boundary/CreateFRAPage";
import { AuthController } from "@/controller/AuthController";
import { FRACategoryController } from "@/controller/FRACategoryController";

export const dynamic = "force-dynamic";

export default async function CreateFRARoutePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;

  const authController = new AuthController();
  const categoryController = new FRACategoryController();

  const account = await authController.requireProfilePath(profileSlug);
  const categoryList = await categoryController.listCategories();

  return (
    <CreateFRAPage
      account={account.toDTO()}
      categoryList={categoryList}
    />
  );
}