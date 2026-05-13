"use client";

import { AdminLayoutBoundary } from "@/boundary/AdminLayoutBoundary";
import { approveUserAccount, createUserAccount } from "@/controller/authActions";
import { useMemo, useState } from "react";
import type { UserAccountDTO } from "@/entity/UserAccount";
import type { UserProfileDTO } from "@/entity/UserProfile";

export function AdminAccountBoundary({
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [profileFilter, setProfileFilter] = useState("all");

  const profileOptions = useMemo(() => {
    const profileMap = new Map<string, string>();

    userAccounts.forEach((userAccount) => {
      profileMap.set(userAccount.profile.profileId, userAccount.profile.profile);
    });

    return Array.from(profileMap.entries()).sort((firstProfile, secondProfile) =>
      firstProfile[1].localeCompare(secondProfile[1]),
    );
  }, [userAccounts]);

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
      const matchesProfile =
        profileFilter === "all" || userAccount.profile.profileId === profileFilter;

      return matchesKeyword && matchesStatus && matchesProfile;
    });
  }, [keyword, profileFilter, statusFilter, userAccounts]);

  const hasActiveFilters =
    keyword.trim() !== "" || statusFilter !== "all" || profileFilter !== "all";

  const clearFilters = () => {
    setKeyword("");
    setStatusFilter("all");
    setProfileFilter("all");
  };

  return (
    <AdminLayoutBoundary account={account} eyebrow="Admin Account" title="Manage Accounts">
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
            <label
              className={`flex min-w-0 flex-1 items-center gap-1 rounded-2xl border border-[#FFB347] px-2 py-1 text-sm font-medium transition ${
                profileFilter === "all" ? "text-[#9f9082]" : "text-[#222a24]"
              }`}
            >
              Profile:
              <select
                value={profileFilter}
                onChange={(event) => setProfileFilter(event.target.value)}
                className={`h-8 min-w-0 flex-1 rounded-md text-sm outline-none ${
                  profileFilter === "all" ? "text-[#9f9082]" : "text-[#222a24]"
                }`}
              >
                <option value="all">All</option>
                {profileOptions.map(([profileId, profile]) => (
                  <option key={profileId} value={profileId}>
                    {profile}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="h-8 text-sm font-semibold text-[#9b5d12] transition hover:border-[#FFB347] hover:text-[#FFB347] disabled:cursor-not-allowed disabled:text-[#c8ad8c]"
            >
              Clear
            </button>
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
                    <button
                      type="button"
                      className="h-9 rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
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
      </section>
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
