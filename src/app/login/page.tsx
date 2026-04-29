import { PublicLoginBoundary } from "@/boundary/PublicLoginBoundary";
import { listPublicProfiles } from "@/controller/authActions";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const profiles = await listPublicProfiles();

  return <PublicLoginBoundary profiles={profiles} />;
}
