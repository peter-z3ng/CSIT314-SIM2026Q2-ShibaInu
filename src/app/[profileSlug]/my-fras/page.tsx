import { MyFRAPage } from "@/boundary/MyFRAPage";
import { AuthController } from "@/controller/AuthController";
import { SearchMyFRAController } from "@/controller/SearchMyFRAController";

export const dynamic = "force-dynamic";

export default async function MyFRAListPage({
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
  const account = await authController.requireProfilePath(profileSlug);

  const searchMyFRAController = new SearchMyFRAController();

  const fraList = await searchMyFRAController.searchMyFRAs({
    userId: account.userId,
    keyword: filters.keyword,
    categoryId: filters.categoryId,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  return (
    <MyFRAPage
      account={account.toDTO()}
      fraList={fraList.map((fra) => fra.toDTO())}
    />
  );
}