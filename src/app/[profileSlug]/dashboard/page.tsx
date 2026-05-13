import { FundraiserHomePage } from "@/boundary/FundraiserHomePage";
import { AuthController } from "@/controller/AuthController";
import { FundraiserController } from "@/controller/FundraiserController";
import { FRACategoryController } from "@/controller/FRACategoryController";

export const dynamic = "force-dynamic";

export default async function DashboardRoutePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;

  const authController = new AuthController();
  const fundraiserController = new FundraiserController();
  const categoryController = new FRACategoryController();

  const account = await authController.requireProfilePath(profileSlug);

  const fraList = await fundraiserController.listMyFRAs(account.userId);
  const categoryList = await categoryController.listCategories();

  return (
    <FundraiserHomePage
      account={account.toDTO()}
      fraList={fraList.map((fra) => fra.toDTO())}
      categoryList={categoryList}
    />
  );
}