"use client";

import { AdminLayoutBoundary } from "@/boundary/AdminLayoutBoundary";
import { approveUserAccount, createUserAccount } from "@/controller/authActions";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { UserAccountDTO } from "@/entity/UserAccount";
import type { UserProfileDTO } from "@/entity/UserProfile";
import { profileToPath } from "@/entity/UserProfile";

export function ViewUserAccountPage({
  account,
  profiles,
  pendingAccounts,
  userAccounts,
  selectedAccount,
}: {
  account: UserAccountDTO;
  profiles: UserProfileDTO[];
  pendingAccounts: UserAccountDTO[];
  userAccounts: UserAccountDTO[];
  selectedAccount: UserAccountDTO | null;
}) {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const profilePath = profileToPath(account.profile);

  const filteredAccounts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return userAccounts.filter((userAccount) => {
      const matchesKeyword =
        !normalizedKeyword ||
        userAccount.username.toLowerCase().includes(normalizedKeyword) ||
        userAccount.email.toLowerCase().includes(normalizedKeyword) ||
        userAccount.profile.profile.toLowerCase().includes(normalizedKeyword);
      const matchesStatus =
        statusFilter === "all" || userAccount.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [keyword, statusFilter, userAccounts]);

  const displayUserAccountDetails = (userAccount: UserAccountDTO | null) => {
    if (!userAccount) {
      return null;
    }

    return (
      <section className="mt-8 rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">User Account Details</h2>
          </div>
          <span className="w-fit rounded-md bg-[#fff2df] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#9b5d12]">
            {userAccount.status}
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <DetailItem label="Username" value={userAccount.username} />
          <DetailItem label="Email" value={userAccount.email} />
          <DetailItem label="Profile" value={userAccount.profile.profile} />
          <DetailItem label="User ID" value={userAccount.userId} />
        </div>
      </section>
    );
  };

  return (
    <AdminLayoutBoundary account={account} title="Manage Accounts">
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <form
          action={createUserAccount}
          className="rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-5 shadow-sm"
        >
          <div className="grid gap-4">
            <Field label="Username" name="username" placeholder="jane_admin" />
            <Field label="Email" name="email" type="email" placeholder="name@example.com" />
            <Field
              label="Password"
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

      <section className="mt-8 rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">User Accounts</h2>
          </div>
          <p className="text-sm font-semibold text-[#9b5d12]">
            {filteredAccounts.length} of {userAccounts.length} Users
          </p>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search username, email, or profile"
              className="h-11 w-full rounded-md border border-[#cfc7b5] bg-white px-3 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30"
            />
          </div>

          <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-md px-3 py-1">
            <label
              className={`flex items-center gap-1 rounded-2xl border border-[#FFB347] px-2 py-1 text-sm font-medium transition ${
                statusFilter === "all" ? "text-[#9f9082]" : "text-[#222a24]"
              }`}
            >
              Status:
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={`h-8 w-28 text-sm outline-none ${
                  statusFilter === "all" ? "text-[#9f9082]" : "text-[#000000]"
                }`}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#f0d8bd] text-[#6f6258]">
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
                    <span className="rounded-md bg-[#fff2df] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#9b5d12]">
                      {userAccount.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <Link
                      href={`/${profilePath}/account?userId=${userAccount.userId}`}
                      className="inline-flex h-9 items-center rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
                    >
                      View details
                    </Link>
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
      </section>

      {displayUserAccountDetails(selectedAccount)}
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#f0d8bd] bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-[#1d2520]">{value}</p>
    </div>
  );
}
