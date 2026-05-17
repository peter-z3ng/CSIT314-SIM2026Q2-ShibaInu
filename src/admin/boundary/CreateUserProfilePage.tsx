"use client";

import { useActionState } from "react";
import { createUserProfile, type CreateUserProfileState } from "@/controller/authActions";

// CreateUserProfilePage
export function CreateUserProfilePage() {
  const initialState: CreateUserProfileState = {
    ok: true,
    message: "",
  };
  const [state, formAction, isPending] = useActionState(createUserProfile, initialState);

  // displaySuccess()
  const displaySuccess = () =>
    state.ok && state.message ? (
      <p className="mt-3 rounded-3xl bg-green-100 px-5 py-3 text-sm font-semibold text-green-700">
        {state.message}
      </p>
    ) : null;

  // displayError()
  const displayError = () =>
    !state.ok && state.message ? (
      <p className="mt-3 rounded-3xl bg-[#fff2df] px-5 py-3 text-sm font-semibold text-[#9b2f12]">
        {state.message}
      </p>
    ) : null;

  // displayForm()
  const displayForm = () => (
    <section className="mt-8">
      <form
        action={formAction}
        className="flex min-h-14 flex-col rounded-4xl border border-[#FFB347] bg-white/40 px-4 py-3 shadow-lg sm:flex-row sm:items-center"
      >
        <input
          name="profile"
          placeholder="Profile name"
          className="h-10 min-w-0 flex-1 bg-transparent px-2 text-lg outline-none placeholder:text-[#9f9082] focus:ring-0"
        />
        <button
          disabled={isPending}
          className="self-stretch rounded-3xl bg-[#FFB347] px-5 text-sm font-semibold text-white transition hover:bg-[#FFBE5C] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating..." : "Create Profile"}
        </button>
      </form>

      {displaySuccess()}
      {displayError()}
    </section>
  );

  return displayForm();
}
