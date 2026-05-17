"use client";

import {
  activateUserAccountWithPassword,
  suspendUserAccountWithPassword,
  updateUserAccountDetails,
} from "@/controller/authActions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { UserAccountDTO } from "@/entity/UserAccount";

type AccountActionStep = "idle" | "confirm" | "password";

// UpdateUserAccountPage
export function UpdateUserAccountPage({
  userAccount,
  onClose,
}: {
  userAccount: UserAccountDTO | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editableAccount, setEditableAccount] = useState<UserAccountDTO | null>(userAccount);
  const [accountMessage, setAccountMessage] = useState("");
  const [accountActionStep, setAccountActionStep] = useState<AccountActionStep>("idle");
  const [adminPassword, setAdminPassword] = useState("");
  const [isSavingAccount, startSavingAccount] = useTransition();
  const [isChangingStatus, startChangingStatus] = useTransition();

  if (!userAccount) {
    return null;
  }

  const displayedAccount = editableAccount ?? userAccount;
  const isActivatingAccount = displayedAccount.status === "suspended";
  const accountAction = isActivatingAccount ? "activate" : "suspend";
  const accountActionLabel = isActivatingAccount ? "Activate" : "Suspend";
  const accountActionPendingLabel = isActivatingAccount ? "Activating..." : "Suspending...";
  const accountActionColor = isActivatingAccount ? "#16a34a" : "#c83232";
  const accountActionHoverClass = isActivatingAccount ? "hover:bg-green-700" : "hover:bg-[#b42626]";

  const updateEditableAccount = (updates: Partial<UserAccountDTO>) => {
    setEditableAccount((currentAccount) =>
      currentAccount ? { ...currentAccount, ...updates } : currentAccount,
    );
  };

  // displaySuccess(...)
  const displaySuccess = (message: string) => (
    <p className="mt-5 rounded-2xl bg-[#f0f8ef] px-4 py-3 text-sm font-semibold text-[#0b5b2d]">
      {message}
    </p>
  );

  // displayError(...)
  const displayError = (message: string) => (
    <p className="mt-5 rounded-2xl bg-[#fff2df] px-4 py-3 text-sm font-semibold text-[#9b5d12]">
      {message}
    </p>
  );

  const isSuccessMessage =
    accountMessage === "User account updated." ||
    accountMessage === "User account suspended." ||
    accountMessage === "User account activated.";

  // displayUserDetails()
  const displayUserDetails = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <button
        type="button"
        aria-label="Close account details"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      <div className="relative w-full max-w-xl rounded-4xl border border-[#f0d8bd] bg-white/40 p-8 shadow-2xl backdrop-blur-sm">
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

        <div className="mt-6 rounded-2xl border border-[#f0d8bd] bg-white/60 p-4">
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
          <label className="block px-2 py-4">
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

        {isEditingAccount ? (
          <div className="mt-5">
            {accountActionStep === "idle" ? (
              <button
                type="button"
                onClick={() => {
                  setAccountMessage("");
                  setAccountActionStep("confirm");
                }}
                className={`h-11 w-full rounded-3xl px-4 text-sm font-semibold text-white transition ${accountActionHoverClass}`}
                style={{ backgroundColor: accountActionColor }}
              >
                {accountActionLabel}
              </button>
            ) : null}

            {accountActionStep === "confirm" ? (
              <div
                className="grid gap-5 rounded-3xl border bg-white/40 p-6"
                style={{ borderColor: accountActionColor }}
              >
                <p
                  className="text-center text-sm font-semibold"
                  style={{ color: accountActionColor }}
                >
                  Are you sure to {accountAction}{" "}
                  <span
                    className="rounded-4xl border px-3 py-0.5 font-bold"
                    style={{ borderColor: accountActionColor, color: accountActionColor }}
                  >
                    {displayedAccount.username}
                  </span>{" "}
                  ?
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountActionStep("idle")}
                    className="h-10 rounded-3xl border border-[#e8b4b4] px-4 text-sm font-semibold text-[#7a1f1f] transition hover:bg-[#ffecec]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountActionStep("password")}
                    className={`h-10 rounded-3xl px-4 text-sm font-semibold text-white transition ${accountActionHoverClass}`}
                    style={{ backgroundColor: accountActionColor }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ) : null}

            {accountActionStep === "password" ? (
              <form
                className="grid gap-5 rounded-3xl border bg-white/40 p-6"
                style={{ borderColor: accountActionColor }}
                onSubmit={(event) => {
                  event.preventDefault();
                  setAccountMessage("");
                  startChangingStatus(async () => {
                    const result = isActivatingAccount
                      ? await activateUserAccountWithPassword({
                          userId: displayedAccount.userId,
                          password: adminPassword,
                        })
                      : await suspendUserAccountWithPassword({
                          userId: displayedAccount.userId,
                          password: adminPassword,
                        });

                    setAccountMessage(result.message);

                    if (result.ok) {
                      const updatedAccount: UserAccountDTO = {
                        ...displayedAccount,
                        status: isActivatingAccount ? "active" : "suspended",
                      };

                      setEditableAccount(updatedAccount);
                      setIsEditingAccount(false);
                      setAccountActionStep("idle");
                      setAdminPassword("");
                      router.refresh();
                    }
                  });
                }}
              >
                <label
                  className="block text-center text-sm font-medium"
                  style={{ color: accountActionColor }}
                >
                  Enter your password to {accountAction} this account
                  <input
                    value={adminPassword}
                    onChange={(event) => setAdminPassword(event.target.value)}
                    type="password"
                    className="mt-4 h-10 w-full rounded-md border bg-white px-3 text-sm text-[#1d2520] outline-none transition focus:ring-1"
                    style={{ borderColor: accountActionColor }}
                    placeholder="Password"
                  />
                </label>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountActionStep("confirm");
                      setAdminPassword("");
                    }}
                    className="h-10 rounded-3xl border border-[#e8b4b4] px-4 text-sm font-semibold text-[#7a1f1f] transition hover:bg-[#ffecec]"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isChangingStatus || !adminPassword}
                    className={`h-10 rounded-3xl px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${accountActionHoverClass}`}
                    style={{ backgroundColor: accountActionColor }}
                  >
                    {isChangingStatus ? accountActionPendingLabel : accountActionLabel}
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        ) : null}

        {accountMessage
          ? isSuccessMessage
            ? displaySuccess(accountMessage)
            : displayError(accountMessage)
          : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-3xl border border-[#f0d8bd] bg-white/60 px-4 text-sm font-semibold text-[#9b5d12] transition hover:bg-[#fff2df]"
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
                    setEditableAccount(displayedAccount);
                    setIsEditingAccount(false);
                    router.refresh();
                  }
                });
              }}
              disabled={isSavingAccount}
              className="h-10 rounded-3xl bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingAccount ? "Updating..." : "Update"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingAccount(true)}
              className="h-10 rounded-3xl bg-[#FFB347] px-5 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return displayUserDetails();
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
    <label className="block border-b border-[#f0d8bd] px-2 py-4">
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
