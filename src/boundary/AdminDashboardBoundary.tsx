import {
  approveUserAccount,
  createProfile,
  suspendUserAccount,
} from "@/controller/authActions";
import type { UserAccount } from "@/entity/UserAccount";
import type { Profile } from "@/entity/UserProfile";

export function AdminDashboardBoundary({
  account,
  pendingAccounts,
  profiles,
}: {
  account: UserAccount;
  pendingAccounts: UserAccount[];
  profiles: Profile[];
}) {
  return (
    <section className="mt-8 grid gap-8">
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <form
          action={createProfile}
          className="rounded-lg border border-[#dfdacd] bg-[#fffdf8] p-5 shadow-sm"
        >
          <h2 className="text-2xl font-bold">Create Profile</h2>
          <div className="mt-5 grid gap-4">
            <label className="block text-sm font-medium">
              Profile Name
              <input
                name="name"
                placeholder="Volunteer Coordinator"
                className="mt-2 h-11 w-full rounded-md border border-[#cfc7b5] px-3 text-sm outline-none transition focus:border-[#1f5a46] focus:ring-2 focus:ring-[#1f5a46]/20"
              />
            </label>
          </div>
          <button className="mt-5 h-11 w-full rounded-md bg-[#1f5a46] px-4 text-sm font-semibold text-white transition hover:bg-[#174435]">
            Create Profile
          </button>
        </form>

        <div className="rounded-lg border border-[#dfdacd] bg-[#fffdf8] p-5 shadow-sm">
          <h2 className="text-2xl font-bold">Profiles</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {profiles.map((profile) => (
              <div key={profile.profileId} className="rounded-md border border-[#e7e0d1] p-4">
                <p className="font-semibold">{profile.profile}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold">Pending Accounts</h2>
          <p className="mt-1 text-sm text-[#586158]">
            Signed in as {account.username}. Approving an account changes its status to active.
          </p>
        </div>
        <p className="rounded-md bg-[#e7efe8] px-3 py-2 text-sm font-semibold text-[#1f5a46]">
          {pendingAccounts.length} pending
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        {pendingAccounts.length ? (
          pendingAccounts.map((pendingAccount) => (
            <article
              key={pendingAccount.userId}
              className="rounded-lg border border-[#dfdacd] bg-[#fffdf8] p-5 shadow-sm"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a5a2f]">
                    {pendingAccount.profile.profile}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{pendingAccount.username}</h3>
                  <p className="mt-1 text-sm text-[#586158]">{pendingAccount.email}</p>
                </div>

                <div className="grid gap-3">
                  <form action={approveUserAccount}>
                    <input type="hidden" name="userId" value={pendingAccount.userId} />
                    <button className="h-11 w-full rounded-md bg-[#1f5a46] px-4 text-sm font-semibold text-white transition hover:bg-[#174435]">
                      Approve
                    </button>
                  </form>
                  <form action={suspendUserAccount}>
                    <input type="hidden" name="userId" value={pendingAccount.userId} />
                    <button className="h-10 w-full rounded-md border border-[#cfc7b5] px-4 text-sm font-semibold text-[#7d3f24] transition hover:bg-[#f1e7d7]">
                      Suspend
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))
        ) : (
          <article className="rounded-lg border border-[#dfdacd] bg-[#fffdf8] p-8 text-center shadow-sm">
            <h3 className="text-xl font-semibold">No pending accounts</h3>
            <p className="mt-2 text-sm text-[#586158]">New pending accounts will appear here.</p>
          </article>
        )}
      </div>
    </section>
  );
}
