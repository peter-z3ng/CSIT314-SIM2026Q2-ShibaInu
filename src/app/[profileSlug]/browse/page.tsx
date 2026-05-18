import { redirect } from "next/navigation";
import { SearchFRAPage } from "@/donee/boundary/SearchFRAPage";
import { AuthController } from "@/controller/AuthController";
import { RouteController } from "@/controller/RouteController";
import { SearchFRAController } from "@/donee/controller/SearchFRAController";

export const dynamic = "force-dynamic";

export default async function DoneeBrowsePage({
  params,
  searchParams,
}: {
  params: Promise<{ profileSlug: string }>;
  searchParams: Promise<{
    keyword?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const { profileSlug } = await params;
  const filters = await searchParams;
  const account = await new AuthController().requireProfilePath(profileSlug);

  if (account.profile.profile.toLowerCase() !== "donee") {
    redirect(RouteController.getDashboardPath(account.profile));
  }

  const searchFRAController = new SearchFRAController();
  const [fraList, allFRAList, categories] = await Promise.all([
    searchFRAController.searchFRA(
      filters.keyword ?? "",
      filters.categoryId ?? "",
      filters.startDate ?? "",
      filters.endDate ?? "",
    ),
    searchFRAController.searchFRA("", ""),
    searchFRAController.listCategories(),
  ]);

  return (
    <SearchFRAPage
      account={account.toDTO()}
      fraList={fraList.map((fra) => fra.toDTO())}
      totalFRA={allFRAList.length}
      categories={categories}
    />
  );
}
