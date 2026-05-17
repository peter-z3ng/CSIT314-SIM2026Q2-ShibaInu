import { ViewUserProfilePage } from "@/admin/boundary/ViewUserProfilePage";
import { ViewUserProfileController } from "@/admin/controller/ViewUserProfileController";
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
  const profileController = new ViewUserProfileController();
  await profileController.viewUserProfile((adminAccount ?? account).userId);
  const [profiles, profileAccountCounts] = await Promise.all([
    profileController.listUserProfiles(),
    profileController.countUserAccountsByProfile(),
  ]);

  return (
    <ViewUserProfilePage
      account={(adminAccount ?? account).toDTO()}
      profiles={profiles.map((profile) => profile.toDTO())}
      profileAccountCounts={profileAccountCounts}
    />
  );
}
