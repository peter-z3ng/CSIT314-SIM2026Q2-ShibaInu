"use client";

import type { UserProfileDTO } from "@/entity/UserProfile";

// SuspendUserProfilePage
export function SuspendUserProfilePage({
  profile,
  accountCount,
  onSuspendRequested,
  onError,
}: {
  profile: UserProfileDTO;
  accountCount: number;
  onSuspendRequested: () => void;
  onError: (message: string) => void;
}) {
  // displayUserList()
  const displayUserList = () => null;

  // displayConfirmation()
  const displayConfirmation = () => null;

  // displaySuccess()
  const displaySuccess = () => "Profile suspended.";

  // displayError()
  const displayError = (message: string) => message;

  // displayCancelMessage()
  const displayCancelMessage = () => "Suspend cancelled.";

  // processSuspend()
  const processSuspend = () => {
    if (accountCount > 0) {
      onError(displayError("Unable to suspend this profile."));
      return;
    }

    onSuspendRequested();
  };

  return (
    <>
      <button
        type="button"
        onClick={processSuspend}
        className="h-11 rounded-3xl bg-[#c83232] text-sm font-semibold text-white transition hover:bg-[#b42626]"
      >
        Suspend
      </button>
      {displayUserList()}
      {displayConfirmation()}
      <span className="sr-only">{displaySuccess()}</span>
      <span className="sr-only">{displayCancelMessage()}</span>
    </>
  );
}
