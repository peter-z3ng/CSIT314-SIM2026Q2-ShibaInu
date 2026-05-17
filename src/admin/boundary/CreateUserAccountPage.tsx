"use client";

import { useActionState } from "react";
import { createUserAccount, type CreateUserAccountState } from "@/controller/authActions";
import type { UserProfileDTO } from "@/entity/UserProfile";

// CreateUserAccountPage
export function CreateUserAccountPage({ profiles }: { profiles: UserProfileDTO[] }) {
  const initialState: CreateUserAccountState = {
    ok: true,
    message: "",
  };
  const [state, formAction, isPending] = useActionState(createUserAccount, initialState);

  // displaySuccess(...)
  const displaySuccess = () =>
    state.ok && state.message ? (
      <p className="rounded-md bg-green-100 px-4 py-3 text-sm font-semibold text-green-700">
        {state.message}
      </p>
    ) : null;

  // displayError(...)
  const displayError = () =>
    !state.ok && state.message ? (
      <p className="rounded-md bg-[#fff2df] px-4 py-3 text-sm font-semibold text-[#9b2f12]">
        {state.message}
      </p>
    ) : null;

  // displayForm(...)
  const displayForm = () => (
    <form
      action={formAction}
      className="rounded-2xl border border-[#FFB347] bg-white/40 p-5 shadow-lg"
    >
      <div className="grid gap-4">
        <Field label="Username" name="username" placeholder="shiba_inu" />
        <Field label="Email" name="email" type="email" placeholder="name@example.com" />
        <Field label="Password" name="password" type="password" placeholder="Password" />
        <label className="block text-sm font-medium">
          Profile
          <div className="relative mt-2">
            <select
              name="profileId"
              className="h-11 w-full appearance-none rounded-md border border-[#cfc7b5] px-3 pr-10 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30"
            >
              {profiles.map((profile) => (
                <option key={profile.profileId} value={profile.profileId}>
                  {profile.profile}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#1d2520]"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </label>
      </div>

      <div className="mt-5 grid gap-3">
        {displaySuccess()}
        {displayError()}
        <button
          disabled={isPending}
          className="h-11 w-full rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating..." : "Create Account"}
        </button>
      </div>
    </form>
  );

  return displayForm();
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        className="mt-2 h-11 w-full rounded-md border border-[#cfc7b5] px-3 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30"
        placeholder={placeholder}
      />
    </label>
  );
}
