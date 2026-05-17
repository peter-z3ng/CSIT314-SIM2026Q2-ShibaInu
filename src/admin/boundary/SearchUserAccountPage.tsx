"use client";

import { SearchUserAccountController } from "@/admin/controller/SearchUserAccountController";
import { useMemo, useState } from "react";
import type { UserAccountDTO } from "@/entity/UserAccount";

// SearchUserAccountPage
export function SearchUserAccountPage({
  currentAccount,
  userAccounts,
  onViewDetails,
}: {
  currentAccount: UserAccountDTO;
  userAccounts: UserAccountDTO[];
  onViewDetails: (userAccount: UserAccountDTO) => void;
}) {
  const [username, setUsername] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchableAccounts = useMemo(
    () => userAccounts.filter((userAccount) => userAccount.userId !== currentAccount.userId),
    [currentAccount.userId, userAccounts],
  );
  const profileOptions = useMemo(() => {
    const uniqueProfiles = new Map<string, string>();

    searchableAccounts.forEach((userAccount) => {
      uniqueProfiles.set(userAccount.profile.profileId, userAccount.profile.profile);
    });

    return Array.from(uniqueProfiles, ([profileId, profile]) => ({ profileId, profile })).sort(
      (firstProfile, secondProfile) => firstProfile.profile.localeCompare(secondProfile.profile),
    );
  }, [searchableAccounts]);
  const filteredAccounts = useMemo(
    () =>
      searchableAccounts.filter((userAccount) => {
        const matchesUsername = new SearchUserAccountController(userAccount).searchByUsername(
          username,
        );
        const matchesStatus =
          selectedStatuses.length === 0 || selectedStatuses.includes(userAccount.status);
        const matchesProfile =
          selectedProfiles.length === 0 || selectedProfiles.includes(userAccount.profile.profileId);

        return matchesUsername && matchesStatus && matchesProfile;
      }),
    [searchableAccounts, selectedProfiles, selectedStatuses, username],
  );

  const toggleStatusFilter = (status: string) => {
    setSelectedStatuses((currentStatuses) =>
      currentStatuses.includes(status)
        ? currentStatuses.filter((currentStatus) => currentStatus !== status)
        : [...currentStatuses, status],
    );
  };

  const toggleProfileFilter = (profileId: string) => {
    setSelectedProfiles((currentProfiles) =>
      currentProfiles.includes(profileId)
        ? currentProfiles.filter((currentProfile) => currentProfile !== profileId)
        : [...currentProfiles, profileId],
    );
  };

  // displaySuccess()
  const displaySuccess = () => (
    <div className="overflow-x-auto rounded-2xl border border-[#FFB347] bg-white/40 p-5 shadow-lg">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#f0d8bd] text-md text-[#6f6258]">
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
                  onClick={() => onViewDetails(userAccount)}
                  className="inline-flex h-9 items-center rounded-3xl bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
                >
                  View details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // displayError()
  const displayError = () => (
    <div className="rounded-2xl border border-[#FFB347] bg-white/40 p-8 text-center text-sm font-semibold text-[#6f6258] shadow-lg">
      No accounts match your search.
    </div>
  );

  return (
    <section className="mt-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">User Accounts</h2>
        <p className="text-sm font-semibold text-[#9b5d12]">
          {filteredAccounts.length} of {searchableAccounts.length} Users
        </p>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[7fr_3fr]">
        <div className="grid gap-6">
          <div className="rounded-4xl border border-[#f0d8bd]/60 bg-white/40 px-4 py-3 shadow-xs">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Search username"
              className="h-10 w-full bg-transparent px-2 text-lg outline-none placeholder:text-[#9f9082]"
            />
          </div>

          {filteredAccounts.length ? displaySuccess() : displayError()}
        </div>

        <aside className="rounded-3xl border border-[#f0d8bd] bg-white/40 p-5 shadow-sm">
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
                setSelectedProfiles([]);
                setIsStatusOpen(false);
                setIsProfileOpen(false);
              }}
              disabled={selectedStatuses.length === 0 && selectedProfiles.length === 0}
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

          <div className="mt-5 border-t border-[#f0d8bd] pt-5">
            <button
              type="button"
              onClick={() => setIsProfileOpen((current) => !current)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="block text-lg font-bold text-[#1d2520]">Profile</span>
              <span className="flex size-8 items-center justify-center rounded-full bg-[#9b5d12] text-sm font-bold text-white">
                <ChevronIcon isOpen={isProfileOpen} />
              </span>
            </button>

            {isProfileOpen ? (
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProfiles([])}
                  className="w-fit text-xs font-semibold text-[#9b5d12] transition hover:text-[#FFB347]"
                >
                  Clear
                </button>

                {profileOptions.map((option) => (
                  <label
                    key={option.profileId}
                    className="flex items-center gap-3 text-sm font-semibold text-[#6f6258]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProfiles.includes(option.profileId)}
                      onChange={() => toggleProfileFilter(option.profileId)}
                      className="size-5 appearance-none rounded border border-[#8a8a8a] bg-white transition checked:border-[#9b5d12] checked:bg-[#9b5d12]"
                    />
                    {option.profile}
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
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
