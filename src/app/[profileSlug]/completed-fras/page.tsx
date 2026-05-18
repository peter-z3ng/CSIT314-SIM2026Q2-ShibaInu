import { SearchCompletedFRAPage } from "@/fundraiser/boundary/SearchCompletedFRAPage";
import { AuthController } from "@/controller/AuthController";
import { SearchCompletedFRAController } from "@/fundraiser/controller/SearchCompletedFRAController";
import { FRACategoryController } from "@/controller/FRACategoryController";

export const dynamic = "force-dynamic";

export default async function CompletedFRARoutePage({
  params,
  searchParams,
}: {
  params: Promise<{ profileSlug: string }>;
  searchParams: Promise<{
    categoryId?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const { profileSlug } = await params;
  const filters = await searchParams;

  const authController = new AuthController();
  const searchCompletedFRAController = new SearchCompletedFRAController();
  const categoryController = new FRACategoryController();

  const account = await authController.requireProfilePath(profileSlug);

  const fraList = await searchCompletedFRAController.searchCompletedFRAs({
    userId: account.userId,
    categoryId: filters.categoryId,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const categoryList = await categoryController.listCategories();

  return (
    <SearchCompletedFRAPage
      account={account.toDTO()}
      fraList={fraList.map((fra) => fra.toDTO())}
      categoryList={categoryList}
    />
  );
}
