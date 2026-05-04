import { AdminLayoutBoundary } from "@/boundary/AdminLayoutBoundary";
import { approveUserAccount, createUserAccount } from "@/controller/authActions";
import type { UserAccountDTO } from "@/entity/UserAccount";
import type { UserProfileDTO } from "@/entity/UserProfile";

export function AdminAccountBoundary({
  account,
  profiles,
  pendingAccounts,
}: {
  account: UserAccountDTO;
  profiles: UserProfileDTO[];
  pendingAccounts: UserAccountDTO[];
}) {
  return (
    <AdminLayoutBoundary account={account} eyebrow="Admin Account" title="Create User Account">
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <form
          action={createUserAccount}
          className="rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-5 shadow-sm"
        >
          <div className="grid gap-4">
            <Field label="Username" name="username" placeholder="jane_admin" />
            <Field label="Email" name="email" type="email" placeholder="name@example.com" />
            <Field
              label="Temporary Password"
              name="password"
              type="password"
              placeholder="Password"
            />
            <label className="block text-sm font-medium">
              Profile
              <select
                name="profileId"
                className="mt-2 h-11 w-full rounded-md border border-[#cfc7b5] bg-white px-3 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30"
              >
                {profiles.map((profile) => (
                  <option key={profile.profileId} value={profile.profileId}>
                    {profile.profile}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button className="mt-5 h-11 w-full rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]">
            Create Account
          </button>
        </form>

        <section className="rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Pending Account</h2>
            <p className="text-sm font-semibold text-[#9b5d12]">
              {pendingAccounts.length} Pending
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            {pendingAccounts.map((pendingAccount) => (
              <div
                key={pendingAccount.userId}
                className="grid gap-3 rounded-md border border-[#f6e7d6] bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{pendingAccount.username}</p>
                  <p className="truncate text-sm text-[#6f6258]">{pendingAccount.email}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#9b5d12]">
                    {pendingAccount.profile.profile}
                  </p>
                </div>
                <form action={approveUserAccount}>
                  <input type="hidden" name="userId" value={pendingAccount.userId} />
                  <button className="h-10 w-full rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C] sm:w-auto">
                    Create
                  </button>
                </form>
              </div>
            ))}

            {!pendingAccounts.length ? (
              <p className="rounded-md border border-[#f6e7d6] bg-white p-4 text-sm text-[#6f6258]">
                No pending accounts.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </AdminLayoutBoundary>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        className="mt-2 h-11 w-full rounded-md border border-[#cfc7b5] px-3 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30"
        placeholder={placeholder}
      />
    </label>
  );
}
