import { redirect } from "next/navigation";
import { SearchFavouriteListPage } from "@/donee/boundary/SearchFavouritePage";
import { AuthController } from "@/controller/AuthController";
import { RouteController } from "@/controller/RouteController";
import { SearchFavouriteController } from "@/donee/controller/SearchFavouriteController";
import { SearchFRAController } from "@/donee/controller/SearchFRAController";

export const dynamic = "force-dynamic";

export default async function DoneeFavoritesPage({
  params,
  searchParams,
}: {
  params: Promise<{ profileSlug: string }>;
  searchParams: Promise<{
    keyword?: string;
    categoryId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const { profileSlug } = await params;
  const { keyword = "", categoryId = "", status = "", startDate = "", endDate = "" } =
    await searchParams;
  const account = await new AuthController().requireProfilePath(profileSlug);

  if (account.profile.profile.toLowerCase() !== "donee") {
    redirect(RouteController.getDashboardPath(account.profile));
  }

  const searchFavouriteController = new SearchFavouriteController();
  const [favourites, allFavourites, categories] = await Promise.all([
    searchFavouriteController.searchFavourite(
      account.userId,
      keyword,
      categoryId,
      status,
      startDate,
      endDate,
    ),
    searchFavouriteController.searchFavourite(account.userId, "", "", "", "", ""),
    new SearchFRAController().listCategories(),
  ]);

  return (
    <SearchFavouriteListPage
      account={account.toDTO()}
      favouriteList={favourites.map((favourite) => favourite.toDTO())}
      totalFavourites={allFavourites.length}
      categories={categories}
    />
  );
}
