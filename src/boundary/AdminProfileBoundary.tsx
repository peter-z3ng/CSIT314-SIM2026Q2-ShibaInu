import { AdminLayoutBoundary } from "@/boundary/AdminLayoutBoundary";
import { createProfile } from "@/controller/authActions";
import type { UserAccountDTO } from "@/entity/UserAccount";
import type { UserProfileDTO } from "@/entity/UserProfile";

export function AdminProfileBoundary({
  account,
  profiles,
}: {
  account: UserAccountDTO;
  profiles: UserProfileDTO[];
}) {
  return (
    <AdminLayoutBoundary account={account} eyebrow="Admin Profile" title="Create User Profile">
      <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
        <form
          action={createProfile}
          className="rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-5 shadow-sm"
        >
          <div className="grid gap-4">
            <label className="block text-sm font-medium">
              Profile Name
              <input
                name="name"
                placeholder="Volunteer Coordinator"
                className="mt-2 h-11 w-full rounded-md border border-[#cfc7b5] px-3 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30"
              />
            </label>
          </div>
          <button className="mt-5 h-11 w-full rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]">
            Create Profile
          </button>
        </form>

        <section className="rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-5 shadow-sm">
          <h2 className="text-2xl font-bold">Profiles</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {profiles.map((profile) => (
              <div key={profile.profileId} className="rounded-md border border-[#f0d8bd] p-3">
                <p className="font-semibold">{profile.profile}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayoutBoundary>
  );
}
