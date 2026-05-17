"use client";

import { suspendUserAccountWithPassword } from "@/controller/authActions";
import { useState, useTransition } from "react";
import type { UserAccountDTO } from "@/entity/UserAccount";

type SuspendStep = "idle" | "confirm" | "password";

// SuspendUserAccountPage
export function SuspendUserAccountPage({
  userAccount,
  onSuspended,
}: {
  userAccount: UserAccountDTO;
  onSuspended: (message: string) => void;
}) {
  const [suspendStep, setSuspendStep] = useState<SuspendStep>("idle");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuspending, startSuspending] = useTransition();

  const resetSuspendFlow = () => {
    setSuspendStep("idle");
    setAdminPassword("");
  };

  // displayUserList()
  const displayUserList = () => null;

  // displayConfirmation()
  const displayConfirmation = () => (
    <div className="grid gap-5 rounded-3xl border border-[#c83232] bg-white/40 p-6">
      <p className="text-center text-sm font-semibold text-[#c83232]">
        Are you sure to suspend{" "}
        <span className="rounded-4xl border border-[#c83232] px-3 py-0.5 font-bold text-[#c83232]">
          {userAccount.username}
        </span>{" "}
        ?
      </p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            setMessage(displayCancelMessage());
            resetSuspendFlow();
          }}
          className="h-10 rounded-3xl border border-[#e8b4b4] px-4 text-sm font-semibold text-[#7a1f1f] transition hover:bg-[#ffecec]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            setMessage("");
            setSuspendStep("password");
          }}
          className="h-10 rounded-3xl bg-[#c83232] px-4 text-sm font-semibold text-white transition hover:bg-[#b42626]"
        >
          Confirm
        </button>
      </div>
    </div>
  );

  // displaySuccess()
  const displaySuccess = () => "User account suspended.";

  // displayError()
  const displayError = (errorMessage: string) => errorMessage;

  // displayCancelMessage()
  const displayCancelMessage = () => "Suspend cancelled.";

  const displayPasswordForm = () => (
    <form
      className="grid gap-5 rounded-3xl border border-[#c83232] bg-white/40 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage("");
        startSuspending(async () => {
          const result = await suspendUserAccountWithPassword({
            userId: userAccount.userId,
            password: adminPassword,
          });

          if (result.ok) {
            const successMessage = displaySuccess();
            setMessage(successMessage);
            resetSuspendFlow();
            onSuspended(successMessage);
            return;
          }

          setMessage(displayError(result.message));
        });
      }}
    >
      <label className="block text-center text-sm font-medium text-[#c83232]">
        Enter your password to suspend this account
        <input
          value={adminPassword}
          onChange={(event) => setAdminPassword(event.target.value)}
          type="password"
          className="mt-4 h-10 w-full rounded-md border border-[#c83232] bg-white px-3 text-sm text-[#1d2520] outline-none transition focus:ring-1 focus:ring-[#c83232]"
          placeholder="Password"
        />
      </label>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            setSuspendStep("confirm");
            setAdminPassword("");
          }}
          className="h-10 rounded-3xl border border-[#e8b4b4] px-4 text-sm font-semibold text-[#7a1f1f] transition hover:bg-[#ffecec]"
        >
          Cancel
        </button>
        <button
          disabled={isSuspending || !adminPassword}
          className="h-10 rounded-3xl bg-[#c83232] px-4 text-sm font-semibold text-white transition hover:bg-[#b42626] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSuspending ? "Suspending..." : "Suspend"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="mt-5">
      {suspendStep === "idle" ? (
        <button
          type="button"
          onClick={() => {
            setMessage("");
            setSuspendStep("confirm");
          }}
          className="h-11 w-full rounded-3xl bg-[#c83232] px-4 text-sm font-semibold text-white transition hover:bg-[#b42626]"
        >
          Suspend
        </button>
      ) : null}

      {suspendStep === "confirm" ? displayConfirmation() : null}
      {suspendStep === "password" ? displayPasswordForm() : null}

      {message ? (
        <p className="mt-5 rounded-2xl bg-[#fff2df] px-4 py-3 text-sm font-semibold text-[#9b5d12]">
          {message}
        </p>
      ) : null}

      {displayUserList()}
    </div>
  );
}
