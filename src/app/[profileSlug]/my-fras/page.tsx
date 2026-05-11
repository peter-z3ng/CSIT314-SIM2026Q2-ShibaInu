import { MyFRAPage } from "@/boundary/MyFRAPage";
import { AuthController } from "@/controller/AuthController";
import { SearchMyFRAController } from "@/controller/SearchMyFRAController";

export const dynamic = "force-dynamic";

export default async function MyFRAListPage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;

  const authController = new AuthController();
  const account = await authController.requireProfilePath(profileSlug);

  const searchMyFRAController = new SearchMyFRAController();

  const fraList = await searchMyFRAController.searchMyFRAs(
    account.userId,
  );

  return (
    <MyFRAPage
      account={account.toDTO()}
      fraList={fraList.map((fra) => fra.toDTO())}
    />
  );
}