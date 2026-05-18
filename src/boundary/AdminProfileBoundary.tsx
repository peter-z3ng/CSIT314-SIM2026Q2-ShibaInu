"use client";

import { Header } from "@/components/Header";
import {
  createProfile,
  suspendUserAccountsByProfile,
} from "@/controller/authActions";
import type { UserAccountDTO } from "@/entity/UserAccount";
import type { UserProfileDTO } from "@/entity/UserProfile";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

export function AdminProfileBoundary({
  account,
  profiles,
  userAccounts,
}: {
  account: UserAccountDTO;
  profiles: UserProfileDTO[];
  userAccounts: UserAccountDTO[];
}) {
  const router = useRouter();
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.profileId ?? "");
  const [showSuspendConfirmation, setShowSuspendConfirmation] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuspending, startSuspending] = useTransition();

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

  function selectUserProfile(profileId: string) {
    setSelectedProfileId(profileId);
    setShowSuspendConfirmation(false);
    setSuspendReason("");
    setSuccessMessage("");
    setErrorMessage("");
  }

  function displayConfirmation() {
    if (!showSuspendConfirmation || !selectedProfile) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
        <button
          type="button"
          aria-label="Close suspend confirmation"
          onClick={() => setShowSuspendConfirmation(false)}
          className="absolute inset-0 bg-black/30"
        />

        <form
          className="relative w-full max-w-lg rounded-lg border border-[#f6c7c7] bg-[#fffaf5] p-6 shadow-2xl"
          onSubmit={(event) => {
            event.preventDefault();
            setSuccessMessage("");
            setErrorMessage("");

            startSuspending(async () => {
              const result = await suspendUserAccountsByProfile({
                profileId: selectedProfile.profileId,
                suspendReason,
              });

              if (result.ok) {
                setSuccessMessage(result.message);
                setShowSuspendConfirmation(false);
                setSuspendReason("");
                router.refresh();
                return;
              }

              setErrorMessage(result.message);
            });
          }}
        >
          <h2 className="text-2xl font-bold text-[#7a1f1f]">Suspend Profile Users</h2>
          <p className="mt-3 text-sm font-semibold text-[#7a1f1f]">
            Are you sure you want to suspend all {selectedProfile.profile} user accounts?
          </p>

          <label className="mt-5 block text-sm font-medium text-[#7a1f1f]">
            Suspend Reason
            <textarea
              value={suspendReason}
              onChange={(event) => setSuspendReason(event.target.value)}
              rows={4}
              placeholder="Enter reason"
              className="mt-2 w-full resize-none rounded-md border border-[#e8b4b4] bg-white px-3 py-2 text-sm text-[#1d2520] outline-none transition focus:border-[#c83232] focus:ring-2 focus:ring-[#c83232]/20"
            />
          </label>

          {displayError()}

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowSuspendConfirmation(false);
                setSuspendReason("");
                setErrorMessage("");
              }}
              className="h-10 rounded-md border border-[#e8b4b4] px-4 text-sm font-semibold text-[#7a1f1f] transition hover:bg-[#ffecec]"
            >
              Cancel
            </button>
            <button
              disabled={isSuspending || !suspendReason.trim()}
              className="h-10 rounded-md bg-[#c83232] px-4 text-sm font-semibold text-white transition hover:bg-[#b42626] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSuspending ? "Suspending..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  function displaySuccess() {
    if (!successMessage) {
      return null;
    }

    return (
      <p className="mt-5 rounded-md bg-[#f0f8ef] px-4 py-3 text-sm font-semibold text-[#0b5b2d]">
        {successMessage}
      </p>
    );
  }

  function displayError() {
    if (!errorMessage) {
      return null;
    }

    return (
      <p className="mt-5 rounded-md bg-[#fff2df] px-4 py-3 text-sm font-semibold text-[#9b5d12]">
        {errorMessage}
      </p>
    );
  }

  function displayUserProfileInfo() {
    return (
      <section className="mt-8 rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-bold">
              {selectedProfile ? `${selectedProfile.profile} Profiles` : "Profile Info"}
            </h2>
            <p className="text-sm font-semibold text-[#9b5d12]">
              {selectedUserAccounts.length} Users
            </p>
          </div>

          {displaySuccess()}

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

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSuccessMessage("");
                setErrorMessage("");
                setShowSuspendConfirmation(true);
              }}
              disabled={!selectedProfile || !selectedUserAccounts.length}
              className="h-10 rounded-md bg-[#c83232] px-4 text-sm font-semibold text-white transition hover:bg-[#b42626] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Suspend User Profile
            </button>
          </div>
        </section>
    );
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
            <button
              type="submit"
              className="mt-5 h-11 w-full rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
            >
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
                  onClick={() => selectUserProfile(profile.profileId)}
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

        {displayUserProfileInfo()}
      </section>

      {displayConfirmation()}
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
