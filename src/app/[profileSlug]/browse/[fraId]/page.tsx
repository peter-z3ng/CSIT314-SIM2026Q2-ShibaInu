import { redirect } from "next/navigation";
import { ViewFRADetailsPage } from "@/donee/boundary/ViewFRADetailsPage";
import { AuthController } from "@/controller/AuthController";
import { RouteController } from "@/controller/RouteController";
import { isFavourite as getIsFavourite } from "@/donee/controller/SaveFavouriteController";
import { SearchFRAController } from "@/donee/controller/SearchFRAController";
import { ViewFRADetailsController } from "@/donee/controller/ViewFRADetailsController";

export const dynamic = "force-dynamic";

export default async function DoneeFRADetailsRoute({
  params,
}: {
  params: Promise<{ profileSlug: string; fraId: string }>;
}) {
  const { profileSlug, fraId } = await params;
  const account = await new AuthController().requireProfilePath(profileSlug);

  if (account.profile.profile.toLowerCase() !== "donee") {
    redirect(RouteController.getDashboardPath(account.profile));
  }

  const searchFRAController = new SearchFRAController();
  const viewFRADetailsController = new ViewFRADetailsController();
  await viewFRADetailsController.incrementFRAViewCount(fraId);

  const [fra, categories, fraList, recentDonations, isFavourite] = await Promise.all([
    viewFRADetailsController.viewFRADetails(fraId),
    searchFRAController.listCategories(),
    searchFRAController.searchFRA("", "all"),
    viewFRADetailsController.viewRecentDonations(fraId),
    getIsFavourite(account.userId, fraId),
  ]);
  const fundraiserUsername = await viewFRADetailsController.viewFundraiserUsername(fra.userId);
  const categoryName =
    categories.find((category) => category.categoryId === fra.categoryId)?.categoryName ??
    "General";
  const currentIndex = fraList.findIndex((listedFRA) => listedFRA.fraId === fra.fraId);
  const previousFraId = currentIndex > 0 ? fraList[currentIndex - 1].fraId : null;
  const nextFraId =
    currentIndex >= 0 && currentIndex < fraList.length - 1 ? fraList[currentIndex + 1].fraId : null;

  return (
    <ViewFRADetailsPage
      account={account.toDTO()}
      fra={fra.toDTO()}
      categoryName={categoryName}
      fundraiserUsername={fundraiserUsername}
      previousFraId={previousFraId}
      nextFraId={nextFraId}
      recentDonations={recentDonations.map((donation) => donation.toDTO())}
      isFavourite={isFavourite}
    />
  );
}
