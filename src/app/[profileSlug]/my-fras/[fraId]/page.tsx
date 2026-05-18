import { RetrieveFRAPage } from "@/fundraiser/boundary/RetrieveFRAPage";
import { AuthController } from "@/controller/AuthController";
import { RetrieveFRAController } from "@/fundraiser/controller/RetrieveFRAController";
import { ViewFRACountController } from "@/fundraiser/controller/ViewFRACountController";
import { ViewFRAShortlistedController } from "@/fundraiser/controller/ViewFRAShortlistedController";
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
  const viewFRACountController = new ViewFRACountController();
  const viewFRAShortlistedController = new ViewFRAShortlistedController();
  const viewFRADetailsController = new ViewFRADetailsController();
  const categoryController = new FRACategoryController();

  const account = await authController.requireProfilePath(profileSlug);

  const fra = await retrieveFRAController.retrieveFRA(fraId);

  if (fra.userId !== account.userId) {
    throw new Error("Unable to retrieve this FRA.");
  }

  const categoryList = await categoryController.listCategories();

  const viewCount = await viewFRACountController.getFRAviewCount(fraId);

  const shortlistedCount = await viewFRAShortlistedController.getFRAshortlistedCount(fraId);

  const recentDonations = await viewFRADetailsController.viewRecentDonations(fraId);

  return (
    <RetrieveFRAPage
      account={account.toDTO()}
      fra={fra.toDTO()}
      viewCount={viewCount}
      shortlistedCount={shortlistedCount}
      categoryList={categoryList}
      recentDonations={recentDonations.map((donation) => donation.toDTO())}
    />
  );
}
