import { LoginPage as LoginBoundaryPage } from "@/LoginPage";
import { listPublicProfiles } from "@/controller/authActions";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const profiles = await listPublicProfiles();

  return <LoginBoundaryPage profiles={profiles} />;
}
