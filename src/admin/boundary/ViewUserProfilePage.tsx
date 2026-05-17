import { Header } from "@/components/Header";
import { createProfile } from "@/controller/authActions";
import type { UserAccountDTO } from "@/entity/UserAccount";
import type { UserProfileDTO } from "@/entity/UserProfile";

// ViewUserProfilePage
export function ViewUserProfilePage({
  account,
  profiles,
}: {
  account: UserAccountDTO;
  profiles: UserProfileDTO[];
}) {
  // displayUserProfileInfo()
  const displayUserProfileInfo = () => (
    <section className="mt-8">
      <h2 className="text-2xl font-bold">Profiles</h2>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-[#FFB347] bg-white/40 p-5 shadow-lg">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#f0d8bd] text-md text-[#6f6258]">
              <th className="py-3 pr-4 font-semibold">Profile</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.profileId} className="border-b border-[#f6e7d6]">
                <td className="py-4 pr-4 font-semibold">{profile.profile}</td>
              </tr>
            ))}
            {!profiles.length ? (
              <tr>
                <td className="py-8 text-center text-sm text-[#6f6258]">
                  No profiles have been created.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
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
