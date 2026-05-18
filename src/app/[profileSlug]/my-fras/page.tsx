import { AuthController } from "@/controller/AuthController";
import { FRACategoryController } from "@/controller/FRACategoryController";
import { SearchFRAPage } from "@/fundraiser/boundary/SearchFRAPage";
import { SearchFRAController } from "@/fundraiser/controller/SearchFRAController";

export const dynamic = "force-dynamic";

export default async function MyFRARoutePage({
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
  const filters = await searchParams;

  const authController = new AuthController();
  const searchFRAController = new SearchFRAController();
  const categoryController = new FRACategoryController();

  const account = await authController.requireProfilePath(profileSlug);

  const fraList = await searchFRAController.searchMyFRAs(
    account.userId,
    filters.keyword,
    filters.categoryId,
    filters.startDate,
    filters.endDate,
    filters.status,
  );

  const categoryList = await categoryController.listCategories();

  return (
    <SearchFRAPage
      account={account.toDTO()}
      fraList={fraList.map((fra) => fra.toDTO())}
      categoryList={categoryList}
    />
  );
}
