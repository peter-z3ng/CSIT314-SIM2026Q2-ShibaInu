"use client";

import { AdminLayoutBoundary } from "@/boundary/AdminLayoutBoundary";
import { useMemo, useState } from "react";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function AdminDashboardBoundary({
  account,
  userAccounts,
}: {
  account: UserAccountDTO;
  userAccounts: UserAccountDTO[];
}) {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [profileFilter, setProfileFilter] = useState("all");

  const profileOptions = useMemo(() => {
    const profiles = new Map<string, string>();

    userAccounts.forEach((userAccount) => {
      profiles.set(userAccount.profile.profileId, userAccount.profile.profile);
    });

    return Array.from(profiles.entries()).sort((firstProfile, secondProfile) =>
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
        profileFilter === "all" ||
        userAccount.profile.profileId === profileFilter;

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
    <AdminLayoutBoundary
      account={account}
      eyebrow="Admin Dashboard"
      title="User Accounts"
    >
      <section className="mt-8 rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">All User Account</h2>
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
              className={`flex items-center gap-1 text-sm font-medium transition border border-[#FFB347] rounded-2xl px-2 py-1 ${
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
              className={`flex min-w-0 flex-1 items-center gap-1 text-sm font-medium transition border border-[#FFB347] rounded-2xl px-2 py-1 ${
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
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="py-3 pr-4 font-semibold">Profile</th>
                <th className="py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((userAccount) => (
                <tr key={userAccount.userId} className="border-b border-[#f6e7d6]">
                  <td className="py-4 pr-4 font-semibold">{userAccount.username}</td>
                  <td className="py-4 pr-4 text-[#6f6258]">{userAccount.email}</td>
                  <td className="py-4 pr-4">{userAccount.profile.profile}</td>
                  <td className="py-4">
                    <span className="rounded-md bg-[#fff2df] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#9b5d12]">
                      {userAccount.status}
                    </span>
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
