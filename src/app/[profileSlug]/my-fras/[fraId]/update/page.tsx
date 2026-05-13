import { UpdateFRAPage } from "@/boundary/UpdateFRAPage";
import { AuthController } from "@/controller/AuthController";
import { RetrieveFRAController } from "@/controller/RetrieveFRAController";
import { FRACategoryController } from "@/controller/FRACategoryController";

export const dynamic = "force-dynamic";

export default async function UpdateFRARoutePage({
  params,
}: {
  params: Promise<{
    profileSlug: string;
    fraId: string;
  }>;
}) {
  const { profileSlug, fraId } = await params;

  const authController = new AuthController();
  const retrieveFRAController = new RetrieveFRAController();
  const categoryController = new FRACategoryController();

  const account = await authController.requireProfilePath(
    profileSlug,
  );

  const fra = await retrieveFRAController.retrieveFRA(
    fraId,
    account.userId,
  );

  const categoryList = await categoryController.listCategories();

  return (
    <UpdateFRAPage
      account={account.toDTO()}
      fra={fra.toDTO()}
      categoryList={categoryList}
    />
  );
}