"use client";

import { Header } from "@/components/Header";
import { createProfile } from "@/controller/authActions";
import type { UserAccountDTO } from "@/entity/UserAccount";
import type { UserProfileDTO } from "@/entity/UserProfile";
import { useMemo, useState } from "react";

export function AdminProfileBoundary({
  account,
  profiles,
  userAccounts,
}: {
  account: UserAccountDTO;
  profiles: UserProfileDTO[];
  userAccounts: UserAccountDTO[];
}) {
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.profileId ?? "");

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.profileId === selectedProfileId),
    [profiles, selectedProfileId],
  );

  const selectedUserAccounts = useMemo(
    () =>
      userAccounts.filter(
        (userAccount) => userAccount.profile.profileId === selectedProfileId,
      ),
    [selectedProfileId, userAccounts],
  );

  function displayUserProfileInfo(profileId: string) {
    setSelectedProfileId(profileId);
  }

  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#1d2520]">
      <Header account={account} />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <h1 className="text-4xl font-bold">Create Profiles</h1>

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
                <button
                  key={profile.profileId}
                  type="button"
                  onClick={() => displayUserProfileInfo(profile.profileId)}
                  className={`rounded-md border p-3 text-left transition ${
                    selectedProfileId === profile.profileId
                      ? "border-[#FFB347] bg-[#fff2df]"
                      : "border-[#f0d8bd] hover:border-[#FFB347] hover:bg-white"
                  }`}
                >
                  <p className="font-semibold">{profile.profile}</p>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-bold">
              {selectedProfile ? `${selectedProfile.profile} Profiles` : "Profile Info"}
            </h2>
            <p className="text-sm font-semibold text-[#9b5d12]">
              {selectedUserAccounts.length} Users
            </p>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#f0d8bd] text-[#6f6258]">
                  <th className="py-3 pr-4 font-semibold">Username</th>
                  <th className="py-3 pr-4 font-semibold">Email</th>
                  <th className="py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedUserAccounts.map((userAccount) => (
                  <tr key={userAccount.userId} className="border-b border-[#f6e7d6]">
                    <td className="py-4 pr-4 font-semibold">{userAccount.username}</td>
                    <td className="py-4 pr-4 text-[#6f6258]">{userAccount.email}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${getAccountStatusClass(
                          userAccount.status,
                        )}`}
                      >
                        {userAccount.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!selectedUserAccounts.length ? (
                  <tr>
                    <td className="py-8 text-center text-sm text-[#6f6258]" colSpan={3}>
                      No users found for this profile.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

function getAccountStatusClass(status: UserAccountDTO["status"]) {
  if (status === "active") {
    return "bg-[#eaf7ef] text-[#0b6b35]";
  }

  if (status === "suspended") {
    return "bg-[#fdecec] text-[#b42318]";
  }

  return "bg-[#fff2df] text-[#9b5d12]";
}
