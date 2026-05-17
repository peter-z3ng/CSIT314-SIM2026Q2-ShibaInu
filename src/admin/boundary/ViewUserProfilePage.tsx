import { UpdateUserProfilePage } from "@/admin/boundary/UpdateUserProfilePage";
import { Header } from "@/components/Header";
import { createProfile } from "@/controller/authActions";
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold">Profiles</h2>

      {profiles.length ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {profiles.map((profile) => (
            <UpdateUserProfilePage
              key={profile.profileId}
              profile={profile}
              accountCount={profileAccountCounts[profile.profileId] ?? 0}
            />
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-2xl border border-[#FFB347] bg-white/40 p-8 text-center text-sm font-semibold text-[#6f6258] shadow-lg">
          No profiles have been created.
        </p>
      )}
    </section>
  );

  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#1d2520]">
      <Header account={account} />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <h1 className="text-4xl font-bold">Manage Profiles</h1>

        <form
          action={createProfile}
          className="mt-8 flex flex-col gap-3 rounded-4xl border border-[#f0d8bd]/60 bg-white/40 px-4 py-3 shadow-xs sm:flex-row sm:items-center"
        >
          <input
            name="name"
            placeholder="Profile name"
            className="h-10 min-w-0 flex-1 bg-transparent px-2 text-lg outline-none placeholder:text-[#9f9082]"
          />
          <button className="h-10 rounded-3xl bg-[#FFB347] px-5 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]">
            Create Profile
          </button>
        </form>

        {displayUserProfileInfo()}
      </section>
    </main>
  );
}
