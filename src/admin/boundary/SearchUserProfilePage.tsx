"use client";

import { SearchUserProfileController } from "@/admin/controller/SearchUserProfileController";
import { UpdateUserProfilePage } from "@/admin/boundary/UpdateUserProfilePage";
import { useMemo, useState } from "react";
import type { UserProfileDTO } from "@/entity/UserProfile";

// SearchUserProfilePage
export function SearchUserProfilePage({
  profiles,
  profileAccountCounts,
}: {
  profiles: UserProfileDTO[];
  profileAccountCounts: Record<string, number>;
}) {
  const [keyword, setKeyword] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const toggleStatusFilter = (status: string) => {
    setSelectedStatuses((currentStatuses) =>
      currentStatuses.includes(status)
        ? currentStatuses.filter((currentStatus) => currentStatus !== status)
        : [...currentStatuses, status],
    );
  };

  // searchFilteredUserProfile(...)
  const searchFilteredUserProfile = (searchKeyword: string, profileStatus: string[]) =>
    new SearchUserProfileController(profiles).searchUserProfile(searchKeyword, profileStatus);

  const searchResults = useMemo(
    () => searchFilteredUserProfile(keyword, selectedStatuses),
    [keyword, profiles, selectedStatuses],
  );

  // displaySearchResults(...)
  const displaySearchResults = (searchResults: UserProfileDTO[]) => (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {searchResults.map((profile) => (
        <UpdateUserProfilePage
          key={profile.profileId}
          profile={profile}
          accountCount={profileAccountCounts[profile.profileId] ?? 0}
        />
      ))}
    </div>
  );

  // displayError()
  const displayError = () => (
    <p className="rounded-2xl border border-[#FFB347] bg-white/40 p-8 text-center text-sm font-semibold text-[#6f6258] shadow-lg">
      No profiles match your search.
    </p>
  );

  return (
    <section className="mt-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">Profiles</h2>
        <p className="text-sm font-semibold text-[#9b5d12]">
          {searchResults.length} of {profiles.length} Profiles
        </p>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[7fr_3fr]">
        <div className="grid gap-6">
          <div className="rounded-4xl border border-[#f0d8bd]/60 bg-white/40 px-4 py-3 shadow-xs">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search profile"
              className="h-10 w-full bg-transparent px-2 text-lg outline-none placeholder:text-[#9f9082]"
            />
          </div>

          {searchResults.length ? displaySearchResults(searchResults) : displayError()}
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
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="size-4"
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
