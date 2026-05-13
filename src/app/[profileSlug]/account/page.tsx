import { ViewUserAccountPage } from "@/admin/ViewUserAccountPage";
import { AdminController } from "@/controller/AdminController";
import { AuthController } from "@/controller/AuthController";
import { ViewUserAccountController } from "@/controller/ViewUserAccountController";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ profileSlug: string }>;
  searchParams: Promise<{ userId?: string }>;
}) {
  const { profileSlug } = await params;
  const { userId } = await searchParams;
  const account = await new AuthController().requireProfilePath(profileSlug);
  const adminAccount = await new AuthController().requireAdmin();
  const adminController = new AdminController();
  const [profiles, pendingAccounts, userAccounts] = await Promise.all([
    adminController.listProfiles(),
    adminController.listPendingUserAccounts(),
    adminController.listUserAccounts(),
  ]);
  const selectedAccount = userId
    ? await new ViewUserAccountController().viewUserAccount(userId)
    : null;

  return (
    <ViewUserAccountPage
      account={(adminAccount ?? account).toDTO()}
      profiles={profiles.map((profile) => profile.toDTO())}
      pendingAccounts={pendingAccounts.map((pendingAccount) => pendingAccount.toDTO())}
      userAccounts={userAccounts.map((userAccount) => userAccount.toDTO())}
      selectedAccount={selectedAccount?.toDTO() ?? null}
    />
  );
}
