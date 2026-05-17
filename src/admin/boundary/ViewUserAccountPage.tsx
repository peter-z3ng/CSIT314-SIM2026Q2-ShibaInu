"use client";

import { CreateUserAccountPage } from "@/admin/boundary/CreateUserAccountPage";
import { Header } from "@/components/Header";
import {
  approveUserAccount,
  suspendUserAccountWithPassword,
  updateUserAccountDetails,
} from "@/controller/authActions";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
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
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<UserAccountDTO | null>(null);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editableAccount, setEditableAccount] = useState<UserAccountDTO | null>(null);
  const [accountMessage, setAccountMessage] = useState("");
  const [isSavingAccount, startSavingAccount] = useTransition();
  const [suspendStep, setSuspendStep] = useState<"idle" | "confirm" | "password">("idle");
  const [suspendPassword, setSuspendPassword] = useState("");
  const [isSuspendingAccount, startSuspendingAccount] = useTransition();

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
    setEditableAccount(userAccount);
    setIsEditingAccount(false);
    setAccountMessage("");
    setSuspendStep("idle");
    setSuspendPassword("");
  };

  const closeUserDetails = () => {
    setSelectedAccount(null);
    setEditableAccount(null);
    setIsEditingAccount(false);
    setAccountMessage("");
    setSuspendStep("idle");
    setSuspendPassword("");
  };

  const updateEditableAccount = (updates: Partial<UserAccountDTO>) => {
    setEditableAccount((currentAccount) =>
      currentAccount ? { ...currentAccount, ...updates } : currentAccount,
    );
  };

  // displayUserDetails(...)
  const displayUserDetails = (userAccount: UserAccountDTO | null) => {
    if (!userAccount) {
      return null;
    }

    const displayedAccount = editableAccount ?? userAccount;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
        <button
          type="button"
          aria-label="Close account details"
          onClick={closeUserDetails}
          className="absolute inset-0 bg-black/30"
        />

        <div className="relative w-full max-w-xl rounded-2xl border border-[#f0d8bd] bg-[#fffaf5] p-6 shadow-2xl">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">User Account Details</h2>
            </div>
            <span
              className={`w-fit rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${getAccountStatusClass(
                displayedAccount.status,
              )}`}
            >
              {displayedAccount.status}
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            <EditableField
              label="Username"
              value={displayedAccount.username}
              isEditing={isEditingAccount}
              onChange={(value) => updateEditableAccount({ username: value })}
            />
            <EditableField
              label="Email"
              value={displayedAccount.email}
              type="email"
              isEditing={isEditingAccount}
              onChange={(value) => updateEditableAccount({ email: value })}
            />
            <label className="block rounded-lg border border-[#f0d8bd] bg-white p-4">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
                Profile
              </span>
              {isEditingAccount ? (
                <input
                  value={displayedAccount.profile.profile}
                  disabled
                  className="mt-2 h-10 w-full rounded-md border border-[#dfd4c7] bg-[#f7f1e8] px-3 text-sm font-semibold text-[#6f6258]"
                />
              ) : (
                <p className="mt-2 break-words text-sm font-semibold text-[#1d2520]">
                  {displayedAccount.profile.profile}
                </p>
              )}
            </label>
          </div>

          {displayedAccount.status !== "suspended" ? (
            <div className="mt-5 rounded-lg border border-[#f6c7c7] bg-[#fff7f7] p-4">
              {suspendStep === "idle" ? (
                <button
                  type="button"
                  onClick={() => {
                    setAccountMessage("");
                    setSuspendStep("confirm");
                  }}
                  className="h-11 w-full rounded-md bg-[#c83232] px-4 text-sm font-semibold text-white transition hover:bg-[#b42626]"
                >
                  Suspend Account
                </button>
              ) : null}

              {suspendStep === "confirm" ? (
                <div className="grid gap-4">
                  <p className="text-sm font-semibold text-[#7a1f1f]">
                    Are you sure you want to suspend {displayedAccount.username}?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSuspendStep("idle")}
                      className="h-10 rounded-md border border-[#e8b4b4] px-4 text-sm font-semibold text-[#7a1f1f] transition hover:bg-[#ffecec]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setSuspendStep("password")}
                      className="h-10 rounded-md bg-[#c83232] px-4 text-sm font-semibold text-white transition hover:bg-[#b42626]"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : null}

              {suspendStep === "password" ? (
                <form
                  className="grid gap-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setAccountMessage("");
                    startSuspendingAccount(async () => {
                      const result = await suspendUserAccountWithPassword({
                        userId: displayedAccount.userId,
                        password: suspendPassword,
                      });

                      setAccountMessage(result.message);

                      if (result.ok) {
                        const suspendedAccount: UserAccountDTO = {
                          ...displayedAccount,
                          status: "suspended",
                        };

                        setSelectedAccount(suspendedAccount);
                        setEditableAccount(suspendedAccount);
                        setIsEditingAccount(false);
                        setSuspendStep("idle");
                        setSuspendPassword("");
                        router.refresh();
                      }
                    });
                  }}
                >
                  <label className="block text-sm font-medium text-[#7a1f1f]">
                    Enter your admin password to suspend this account
                    <input
                      value={suspendPassword}
                      onChange={(event) => setSuspendPassword(event.target.value)}
                      type="password"
                      className="mt-2 h-10 w-full rounded-md border border-[#e8b4b4] bg-white px-3 text-sm text-[#1d2520] outline-none transition focus:border-[#c83232] focus:ring-2 focus:ring-[#c83232]/20"
                      placeholder="Admin password"
                    />
                  </label>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSuspendStep("confirm");
                        setSuspendPassword("");
                      }}
                      className="h-10 rounded-md border border-[#e8b4b4] px-4 text-sm font-semibold text-[#7a1f1f] transition hover:bg-[#ffecec]"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isSuspendingAccount || !suspendPassword}
                      className="h-10 rounded-md bg-[#c83232] px-4 text-sm font-semibold text-white transition hover:bg-[#b42626] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSuspendingAccount ? "Suspending..." : "Suspend Account"}
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          ) : null}

          {accountMessage ? (
            <p
              className={`mt-5 rounded-md px-4 py-3 text-sm font-semibold ${
                accountMessage === "User account updated." ||
                accountMessage === "User account suspended."
                  ? "bg-[#f0f8ef] text-[#0b5b2d]"
                  : "bg-[#fff2df] text-[#9b5d12]"
              }`}
            >
              {accountMessage}
            </p>
          ) : null}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeUserDetails}
              className="h-10 rounded-md border border-[#f0d8bd] px-4 text-sm font-semibold text-[#9b5d12] transition hover:bg-[#fff2df]"
            >
              Close
            </button>
            {isEditingAccount ? (
              <button
                type="button"
                onClick={() => {
                  setAccountMessage("");
                  startSavingAccount(async () => {
                    const result = await updateUserAccountDetails({
                      userId: displayedAccount.userId,
                      username: displayedAccount.username,
                      email: displayedAccount.email,
                      status: displayedAccount.status,
                    });

                    setAccountMessage(result.message);

                    if (result.ok) {
                      setSelectedAccount(displayedAccount);
                      setEditableAccount(displayedAccount);
                      setIsEditingAccount(false);
                      router.refresh();
                    }
                  });
                }}
                disabled={isSavingAccount}
                className="h-10 rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingAccount ? "Saving..." : "Save changes"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingAccount(true)}
                className="h-10 rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

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
                        className="inline-flex h-9 items-center rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
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

function EditableField({
  label,
  value,
  onChange,
  isEditing,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  type?: string;
}) {
  return (
    <label className="block rounded-lg border border-[#f0d8bd] bg-white p-4">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">{label}</span>
      {isEditing ? (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={type}
          className="mt-2 h-10 w-full rounded-md border border-[#cfc7b5] px-3 text-sm font-semibold outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30"
        />
      ) : (
        <p className="mt-2 break-words text-sm font-semibold text-[#1d2520]">{value}</p>
      )}
    </label>
  );
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
