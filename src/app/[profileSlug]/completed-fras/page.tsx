import { CompletedFRAPage } from "@/boundary/CompletedFRAPage";
import { AuthController } from "@/controller/AuthController";
import { CompletedFRAController } from "@/controller/CompletedFRAController";
import { FRACategoryController } from "@/controller/FRACategoryController";

export const dynamic = "force-dynamic";

export default async function CompletedFRARoutePage({
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

  const authController = new AuthController();
  const completedFRAController = new CompletedFRAController();
  const categoryController = new FRACategoryController();

  const account = await authController.requireProfilePath(profileSlug);

  const fraList = await completedFRAController.searchCompletedFRAs({
    userId: account.userId,
    keyword: filters.keyword,
    categoryId: filters.categoryId,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const categoryList = await categoryController.listCategories();

  return (
    <CompletedFRAPage
      account={account.toDTO()}
      fraList={fraList.map((fra) => fra.toDTO())}
      categoryList={categoryList}
    />
  );
}