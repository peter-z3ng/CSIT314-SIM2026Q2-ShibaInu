import { redirect } from "next/navigation";
import { SearchFavouriteListPage } from "@/boundary/SearchFavouriteListPage";
import { AuthController } from "@/controller/AuthController";
import { RouteController } from "@/controller/RouteController";
import { SearchFavouriteController } from "@/controller/SearchFavouriteController";
import { SearchFRAController } from "@/controller/SearchFRAController";

export const dynamic = "force-dynamic";

export default async function DoneeFavoritesPage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;
  const account = await new AuthController().requireProfilePath(profileSlug);

  if (account.profile.profile.toLowerCase() !== "donee") {
    redirect(RouteController.getDashboardPath(account.profile));
  }

  const [favourites, categories] = await Promise.all([
    new SearchFavouriteController().searchFavourite(account.userId, "", "all", "all"),
    new SearchFRAController().listCategories(),
  ]);

  return (
    <SearchFavouriteListPage
      account={account.toDTO()}
      favouriteList={favourites.map((favourite) => favourite.toDTO())}
      categories={categories}
    />
  );
}
