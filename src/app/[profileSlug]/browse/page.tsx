import { redirect } from "next/navigation";
import { SearchBoundary } from "@/boundary/SearchBoundary";
import { AuthController } from "@/controller/AuthController";
import { RouteController } from "@/controller/RouteController";
import { SearchFRAController } from "@/controller/SearchFRAController";

export const dynamic = "force-dynamic";

export default async function DoneeBrowsePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;
  const account = await new AuthController().requireProfilePath(profileSlug);

  if (account.profile.profile.toLowerCase() !== "donee") {
    redirect(RouteController.getDashboardPath(account.profile));
  }

  const searchFRAController = new SearchFRAController();
  const [fraList, categories] = await Promise.all([
    searchFRAController.searchFRA(),
    searchFRAController.listCategories(),
  ]);

  return (
    <SearchBoundary
      account={account.toDTO()}
      fraList={fraList.map((fra) => fra.toDTO())}
      categories={categories}
    />
  );
}
