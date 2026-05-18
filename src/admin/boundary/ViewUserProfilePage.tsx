import { CreateUserProfilePage } from "@/admin/boundary/CreateUserProfilePage";
import { SearchUserProfilePage } from "@/admin/boundary/SearchUserProfilePage";
import { Header } from "@/boundary/Header";
import type { UserAccountDTO } from "@/entity/UserAccount";
import type { UserProfileDTO } from "@/entity/UserProfile";

// ViewUserProfilePage
export function ViewUserProfilePage({
  account,
  profiles,
  profileAccountCounts,
}: {
  account: UserAccountDTO;
  profiles: UserProfileDTO[];
  profileAccountCounts: Record<string, number>;
}) {
  // displayUserProfileInfo()
  const displayUserProfileInfo = () => (
    <SearchUserProfilePage profiles={profiles} profileAccountCounts={profileAccountCounts} />
  );

  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#1d2520]">
      <Header account={account} />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <h1 className="text-4xl font-bold">Manage Profiles</h1>

        <CreateUserProfilePage />

        {displayUserProfileInfo()}
      </section>
    </main>
  );
}
