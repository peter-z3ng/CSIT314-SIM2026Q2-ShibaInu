"use client";

import { CreateUserAccountPage } from "@/admin/boundary/CreateUserAccountPage";
import { UpdateUserAccountPage } from "@/admin/boundary/UpdateUserAccountPage";
import { Header } from "@/components/Header";
import { approveUserAccount } from "@/controller/authActions";
import { useMemo, useState } from "react";
import type { UserAccountDTO } from "@/entity/UserAccount";
import type { UserProfileDTO } from "@/entity/UserProfile";

// ViewUserAccountPage
export function ViewUserAccountPage({
  account,
  profiles,
  pendingAccounts,
  userAccounts,
}: {
  account: UserAccountDTO;
  profiles: UserProfileDTO[];
  pendingAccounts: UserAccountDTO[];
  userAccounts: UserAccountDTO[];
}) {
  const [keyword, setKeyword] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<UserAccountDTO | null>(null);

  const filteredAccounts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return userAccounts.filter((userAccount) => {
      const matchesKeyword =
        !normalizedKeyword ||
        userAccount.username.toLowerCase().includes(normalizedKeyword) ||
        userAccount.email.toLowerCase().includes(normalizedKeyword) ||
        userAccount.profile.profile.toLowerCase().includes(normalizedKeyword);
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(userAccount.status);

      return matchesKeyword && matchesStatus;
    });
  }, [keyword, selectedStatuses, userAccounts]);

  const toggleStatusFilter = (status: string) => {
    setSelectedStatuses((currentStatuses) =>
      currentStatuses.includes(status)
        ? currentStatuses.filter((currentStatus) => currentStatus !== status)
        : [...currentStatuses, status],
    );
  };

  const openUserDetails = (userAccount: UserAccountDTO) => {
    setSelectedAccount(userAccount);
  };

  const closeUserDetails = () => {
    setSelectedAccount(null);
  };

  // displayUserDetails(...)
  const displayUserDetails = (userAccount: UserAccountDTO | null) => (
    <UpdateUserAccountPage userAccount={userAccount} onClose={closeUserDetails} />
  );

  // displayUserList(...)
  const displayUserList = () => (
    <section className="mt-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">User Accounts</h2>
        <p className="text-sm font-semibold text-[#9b5d12]">
          {filteredAccounts.length} of {userAccounts.length} Users
        </p>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[7fr_3fr]">
        <div className="grid gap-6">
          <div className="rounded-4xl border border-[#f0d8bd]/60 bg-white/40 px-4 py-3 shadow-xs">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search username, email, or profile"
              className="h-10 w-full bg-transparent px-2 text-lg outline-none placeholder:text-[#9f9082]"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#FFB347] bg-white/40 p-5 shadow-lg">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#f0d8bd] text-[#6f6258] text-md">
                  <th className="py-3 pr-4 font-semibold">Username</th>
                  <th className="py-3 pr-4 font-semibold">Profile</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((userAccount) => (
                  <tr key={userAccount.userId} className="border-b border-[#f6e7d6]">
                    <td className="py-4 pr-4 font-semibold">{userAccount.username}</td>
                    <td className="py-4 pr-4">{userAccount.profile.profile}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${getAccountStatusClass(
                          userAccount.status,
                        )}`}
                      >
                        {userAccount.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        type="button"
                        onClick={() => openUserDetails(userAccount)}
                        className="inline-flex h-9 items-center rounded-3xl bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
                {!filteredAccounts.length ? (
                  <tr>
                    <td className="py-8 text-center text-sm text-[#6f6258]" colSpan={4}>
                      No accounts match your search.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-2xl border border-[#f0d8bd] bg-white/40 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 5h20" />
                <path d="M6 12h12" />
                <path d="M9 19h6" />
              </svg>
              Filters
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedStatuses([]);
                setIsStatusOpen(false);
              }}
              disabled={selectedStatuses.length === 0}
              className="rounded-md border border-[#f0d8bd] px-3 py-1.5 text-xs font-bold text-[#9b5d12] transition hover:bg-[#fff2df] hover:text-[#FFB347] disabled:cursor-not-allowed disabled:text-[#c8ad8c]"
            >
              Clear all
            </button>
          </div>

          <div className="mt-5 border-t border-[#f0d8bd] pt-5">
            <button
              type="button"
              onClick={() => setIsStatusOpen((current) => !current)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="block text-lg font-bold text-[#1d2520]">Status</span>
              <span className="flex size-8 items-center justify-center rounded-full bg-[#9b5d12] text-sm font-bold text-white">
                <ChevronIcon isOpen={isStatusOpen} />
              </span>
            </button>

            {isStatusOpen ? (
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedStatuses([])}
                  className="w-fit text-xs font-semibold text-[#9b5d12] transition hover:text-[#FFB347]"
                >
                  Clear
                </button>

                {[
                  { value: "active", label: "Active" },
                  { value: "pending", label: "Pending" },
                  { value: "suspended", label: "Suspended" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 text-sm font-semibold text-[#6f6258]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(option.value)}
                      onChange={() => toggleStatusFilter(option.value)}
                      className="size-5 appearance-none rounded border border-[#8a8a8a] bg-white transition checked:border-[#9b5d12] checked:bg-[#9b5d12]"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-[#FFF4EC] text-black">
      <Header account={account} />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <h1 className="text-4xl font-bold">Manage Accounts</h1>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          <CreateUserAccountPage profiles={profiles} />

          <section className="rounded-2xl border border-[#f0d8bd] bg-white/40 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">Pending Accounts</h2>
              <p className="text-sm font-semibold text-[#9b5d12]">
                {pendingAccounts.length} Pending
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {pendingAccounts.map((pendingAccount) => (
                <div
                  key={pendingAccount.userId}
                  className="grid gap-3 rounded-2xl border border-[#FFB347] bg-white/40 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate mb-1 text-md font-bold">{pendingAccount.username}</p>
                    <p className="truncate text-sm text-[#6f6258]">{pendingAccount.email}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#9b5d12]">
                      {pendingAccount.profile.profile}
                    </p>
                  </div>
                  <form action={approveUserAccount}>
                    <input type="hidden" name="userId" value={pendingAccount.userId} />
                    <button className="h-10 w-full rounded-3xl bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C] sm:w-auto">
                      Create
                    </button>
                  </form>
                </div>
              ))}

              {!pendingAccounts.length ? (
                <p className="rounded-md border border-[#f6e7d6] bg-white/60 p-4 text-sm text-[#6f6258]">
                  No pending accounts.
                </p>
              ) : null}
            </div>
          </section>
        </div>

        {displayUserList()}
      </section>

      {displayUserDetails(selectedAccount)}
    </main>
  );
}

function getAccountStatusClass(status: UserAccountDTO["status"]) {
  if (status === "active") {
    return "bg-green-100 text-green-700";
  }

  if (status === "suspended") {
    return "bg-red-100 text-red-600";
  }

  return "bg-[#fff2df] text-[#c77700]";
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={isOpen ? "m4.5 15.75 7.5-7.5 7.5 7.5" : "m19.5 8.25-7.5 7.5-7.5-7.5"}
      />
    </svg>
  );
}
