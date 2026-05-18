import { AdminProfileBoundary } from "@/boundary/AdminProfileBoundary";
import { AdminController } from "@/controller/AdminController";
import { AuthController } from "@/controller/AuthController";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;
  const account = await new AuthController().requireProfilePath(profileSlug);
  const adminAccount = await new AuthController().requireAdmin();
  const adminController = new AdminController();
  const [profiles, userAccounts] = await Promise.all([
    adminController.listProfiles(),
    adminController.listUserAccounts(),
  ]);

  return (
    <AdminProfileBoundary
      account={(adminAccount ?? account).toDTO()}
      profiles={profiles.map((profile) => profile.toDTO())}
      userAccounts={userAccounts.map((userAccount) => userAccount.toDTO())}
    />
  );
}
