import { RetrieveFRAPage } from "@/boundary/RetrieveFRAPage";
import { AuthController } from "@/controller/AuthController";
import { RetrieveFRAController } from "@/controller/RetrieveFRAController";
import { ViewFRADetailsController } from "@/donee/controller/ViewFRADetailsController";
import { FRACategoryController } from "@/controller/FRACategoryController";

export const dynamic = "force-dynamic";

export default async function RetrieveFRARoutePage({
  params,
}: {
  params: Promise<{ profileSlug: string; fraId: string }>;
}) {
  const { profileSlug, fraId } = await params;

  const authController = new AuthController();
  const retrieveFRAController = new RetrieveFRAController();
  const viewFRADetailsController = new ViewFRADetailsController();
  const categoryController = new FRACategoryController();

  const account = await authController.requireProfilePath(profileSlug);

  const fra = await retrieveFRAController.retrieveFRA(fraId, account.userId);

  const categoryList = await categoryController.listCategories();

  const recentDonations = await viewFRADetailsController.viewRecentDonations(fraId);

  return (
    <RetrieveFRAPage
      account={account.toDTO()}
      fra={fra.toDTO()}
      categoryList={categoryList}
      recentDonations={recentDonations.map((donation) => donation.toDTO())}
    />
  );
}
