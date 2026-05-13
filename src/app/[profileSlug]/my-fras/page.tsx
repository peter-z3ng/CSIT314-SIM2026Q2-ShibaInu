import { MyFRAPage } from "@/boundary/MyFRAPage";
import { AuthController } from "@/controller/AuthController";
import { SearchMyFRAController } from "@/controller/SearchMyFRAController";
import { FRACategoryController } from "@/controller/FRACategoryController";

export const dynamic = "force-dynamic";

export default async function MyFRARoutePage({
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
  const searchMyFRAController = new SearchMyFRAController();
  const categoryController = new FRACategoryController();

  const account = await authController.requireProfilePath(profileSlug);

  const fraList = await searchMyFRAController.searchMyFRAs({
    userId: account.userId,
    keyword: filters.keyword,
    categoryId: filters.categoryId,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const categoryList = await categoryController.listCategories();

  return (
    <MyFRAPage
      account={account.toDTO()}
      fraList={fraList.map((fra) => fra.toDTO())}
      categoryList={categoryList}
    />
  );
}