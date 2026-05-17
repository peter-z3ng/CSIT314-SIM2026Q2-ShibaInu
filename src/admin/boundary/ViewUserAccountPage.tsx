"use client";

import { CreateUserAccountPage } from "@/admin/boundary/CreateUserAccountPage";
import { SearchUserAccountPage } from "@/admin/boundary/SearchUserAccountPage";
import { UpdateUserAccountPage } from "@/admin/boundary/UpdateUserAccountPage";
import { Header } from "@/components/Header";
import { approveUserAccount } from "@/controller/authActions";
import { useState } from "react";
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
  const [selectedAccount, setSelectedAccount] = useState<UserAccountDTO | null>(null);

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

        <SearchUserAccountPage
          currentAccount={account}
          userAccounts={userAccounts}
          onViewDetails={openUserDetails}
        />
      </section>

      {displayUserDetails(selectedAccount)}
    </main>
  );
}
