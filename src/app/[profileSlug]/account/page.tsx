import { ViewUserAccountPage } from "@/admin/boundary/ViewUserAccountPage";
import { AdminController } from "@/controller/AdminController";
import { AuthController } from "@/controller/AuthController";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;
  const account = await new AuthController().requireProfilePath(profileSlug);
  const adminAccount = await new AuthController().requireAdmin();
  const adminController = new AdminController();
  const [profiles, pendingAccounts, userAccounts] = await Promise.all([
    adminController.listProfiles(),
    adminController.listPendingUserAccounts(),
    adminController.listUserAccounts(),
  ]);

  return (
    <ViewUserAccountPage
      account={(adminAccount ?? account).toDTO()}
      profiles={profiles.map((profile) => profile.toDTO())}
      pendingAccounts={pendingAccounts.map((pendingAccount) => pendingAccount.toDTO())}
      userAccounts={userAccounts.map((userAccount) => userAccount.toDTO())}
    />
  );
}
