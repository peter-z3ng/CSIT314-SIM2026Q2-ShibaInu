"use client";

import { SuspendUserProfilePage } from "@/admin/boundary/SuspendUserProfilePage";
import {
  activateUserProfileWithPassword,
  deleteUserProfileWithPassword,
  suspendUserProfileWithPassword,
  updateUserProfile,
} from "@/controller/authActions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { UserProfileDTO } from "@/entity/UserProfile";

type ProfileAction = "activate" | "suspend" | "delete";
type ProfileActionStep = "idle" | "confirm" | "password";

// UpdateUserProfilePage
export function UpdateUserProfilePage({
  profile,
  accountCount,
}: {
  profile: UserProfileDTO;
  accountCount: number;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState(profile.profile);
  const [message, setMessage] = useState("");
  const [profileAction, setProfileAction] = useState<ProfileAction | null>(null);
  const [profileActionStep, setProfileActionStep] = useState<ProfileActionStep>("idle");
  const [adminPassword, setAdminPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isActionPending, startActionTransition] = useTransition();

  // submitUpdatedProfile(...)
  const submitUpdatedProfile = () => {
    setMessage("");
    startTransition(async () => {
      const result = await updateUserProfile({
        profileId: profile.profileId,
        profile: profileName,
      });

      setMessage(result.message);

      if (result.ok) {
        setIsEditing(false);
        router.refresh();
      }
    });
  };

  // displaySuccess()
  const displaySuccess = () => (
    <p className="mt-3 rounded-2xl bg-[#f0f8ef] px-4 py-3 text-xs font-semibold text-[#0b5b2d]">
      {message}
    </p>
  );

  // displayError()
  const displayError = () => (
    <p className="mt-3 rounded-2xl bg-[#fff2df] px-4 py-3 text-xs font-semibold text-[#c83232]">
      {message}
    </p>
  );

  const isSuccessMessage =
    message === "Profile updated." ||
    message === "Profile activated." ||
    message === "Profile suspended." ||
    message === "Profile deleted.";

  const resetActionFlow = () => {
    setProfileAction(null);
    setProfileActionStep("idle");
    setAdminPassword("");
  };

  const startProfileAction = (action: ProfileAction) => {
    setMessage("");

    if (action !== "activate" && accountCount > 0) {
      setMessage(action === "delete" ? "Unable to delete this profile." : "Unable to suspend this profile.");
      return;
    }

    setProfileAction(action);
    setProfileActionStep("confirm");
  };

  const submitProfileAction = () => {
    if (!profileAction) {
      return;
    }

    setMessage("");
    startActionTransition(async () => {
      const result =
        profileAction === "delete"
          ? await deleteUserProfileWithPassword({
              profileId: profile.profileId,
              password: adminPassword,
            })
          : profileAction === "activate"
            ? await activateUserProfileWithPassword({
                profileId: profile.profileId,
                password: adminPassword,
              })
            : await suspendUserProfileWithPassword({
                profileId: profile.profileId,
                password: adminPassword,
              });

      setMessage(result.message);

      if (result.ok) {
        resetActionFlow();
        router.refresh();
      }
    });
  };

  const actionColor = profileAction === "activate" ? "#0b7a3b" : "#c83232";

  return (
    <article className="flex min-h-[520px] flex-col rounded-4xl border border-[#FFB347] bg-white/40 px-6 pb-5 pt-8 text-center shadow-lg hover:scale-105 transition">
      <span
        className={`mx-auto block w-fit rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${
          profile.status === "suspended" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
        }`}
      >
        {profile.status}
      </span>

      <div className="mx-auto mt-4 -mb-2 flex size-20 items-center justify-center rounded-full bg-[#fff2df] text-[#FFB347]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-14"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="grid min-h-36 content-center gap-5">
        {isEditing ? (
          <input
            value={profileName}
            onChange={(event) => setProfileName(event.target.value)}
            className="h-10 w-full rounded-md border border-[#cfc7b5] bg-white/60 px-3 text-center text-sm font-semibold outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30"
          />
        ) : (
          <p className="break-words text-xl font-bold">{profileName}</p>
        )}

        <div className="flex h-11 flex-wrap items-center justify-center gap-3 text-sm font-semibold text-[#6f6258]">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setProfileName(profile.profile);
                  setIsEditing(false);
                  setMessage("");
                }}
                className="inline-flex h-9 min-w-[86px] items-center justify-center rounded-full border border-[#f0d8bd] bg-white/60 px-4 text-xs font-semibold text-[#9b5d12] transition hover:bg-[#fff2df]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={submitUpdatedProfile}
                className="inline-flex h-9 min-w-[86px] items-center justify-center rounded-full bg-[#FFB347] px-4 text-xs font-semibold text-white transition hover:bg-[#FFBE5C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Update..." : "Update"}
              </button>
            </>
          ) : (
            <>
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                resetActionFlow();
                setMessage("");
              }}
              className="inline-flex h-9 min-w-[86px] items-center justify-center gap-1 rounded-full border border-[#f0d8bd] bg-white/60 px-3 text-xs font-semibold text-[#9b5d12] transition hover:bg-[#fff2df]"
            >
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Edit
            </button>
            <span className="translate-x-3 text-[#9b5d12]">{accountCount}</span>
            <span className="inline-flex size-9 shrink-0 items-center justify-center text-[#9b5d12]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="block size-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            </span>
            </>
          )}
        </div>
      </div>

      <div className="grid justify-items-center">
        <div className="grid w-4/5 gap-3">
          {profile.status === "suspended" ? (
            <button
              type="button"
              onClick={() => startProfileAction("activate")}
              className="h-11 rounded-3xl bg-[#0b7a3b] text-sm font-semibold text-white transition hover:bg-[#096532]"
            >
              Activate
            </button>
          ) : (
            <SuspendUserProfilePage
              profile={profile}
              accountCount={accountCount}
              onSuspendRequested={() => startProfileAction("suspend")}
              onError={(errorMessage) => {
                resetActionFlow();
                setMessage(errorMessage);
              }}
            />
          )}
          <button
            type="button"
            onClick={() => startProfileAction("delete")}
            className="text-sm -mt-1 text-[#c83232] transition hover:underline"
          >
            Remove
          </button>
        </div>
      </div>

      {profileAction || message ? (
      <div className="mt-4 min-h-[118px]">
        {profileAction && profileActionStep === "confirm" ? (
          <div
            className="grid gap-3 rounded-3xl border bg-white/40 p-4"
            style={{ borderColor: actionColor }}
          >
            <p className="text-sm font-semibold" style={{ color: actionColor }}>
              {profileAction === "delete" ? "Remove" : profileAction === "activate" ? "Activate" : "Suspend"}{" "}
              <span className="rounded-4xl border px-3 py-0.5 font-bold" style={{ borderColor: actionColor }}>
                {profileName}
              </span>
              ?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={resetActionFlow}
                className="h-9 rounded-3xl border border-[#e8b4b4] px-4 text-sm font-semibold text-[#7a1f1f] transition hover:bg-[#ffecec]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setProfileActionStep("password")}
                className="h-9 rounded-3xl px-4 text-sm font-semibold text-white transition"
                style={{ backgroundColor: actionColor }}
              >
                Confirm
              </button>
            </div>
          </div>
        ) : null}

        {profileAction && profileActionStep === "password" ? (
          <form
            className="grid gap-3 rounded-3xl border bg-white/40 p-4"
            style={{ borderColor: actionColor }}
            onSubmit={(event) => {
              event.preventDefault();
              submitProfileAction();
            }}
          >
            <label className="block">
              <span className="sr-only">Password</span>
              <input
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                type="password"
                className="h-9 w-full rounded-md border bg-white px-3 text-sm text-[#1d2520] outline-none transition focus:ring-1"
                style={{ borderColor: actionColor }}
                placeholder="Enter your password"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setProfileActionStep("confirm");
                  setAdminPassword("");
                }}
                className="h-9 rounded-3xl border border-[#e8b4b4] px-4 text-sm font-semibold text-[#7a1f1f] transition hover:bg-[#ffecec]"
              >
                Cancel
              </button>
              <button
                disabled={isActionPending || !adminPassword}
                className="h-9 rounded-3xl px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundColor: actionColor }}
              >
                {isActionPending
                  ? "Working..."
                  : profileAction === "delete"
                    ? "Delete"
                    : profileAction === "activate"
                      ? "Activate"
                      : "Suspend"}
              </button>
            </div>
          </form>
        ) : null}

        {message ? (isSuccessMessage ? displaySuccess() : displayError()) : null}
      </div>
      ) : null}
    </article>
  );
}
