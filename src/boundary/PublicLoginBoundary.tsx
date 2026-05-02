"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RouteController } from "@/controller/RouteController";
import { createPendingUserAccount, lookupEmail, type EmailLookupDTO } from "@/controller/authActions";
import type { UserProfileDTO } from "@/entity/UserProfile";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LoginStep = "email" | "password" | "signup";

export function PublicLoginBoundary({ profiles }: { profiles: UserProfileDTO[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<LoginStep>("email");
  const [lookup, setLookup] = useState<EmailLookupDTO | null>(null);
  const [message, setMessage] = useState("");
  const email = lookup?.email ?? "";

  function handleEmailLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await lookupEmail(String(form.get("email") ?? ""));
        setLookup(result);
        setStep(
          result.status === "existing"
            ? "password"
            : result.status === "new"
              ? "signup"
              : "email",
        );
        setMessage(
          result.status === "pending"
            ? "Your account is waiting for admin approval."
            : result.status === "suspended"
              ? "This account is suspended. Contact an administrator."
            : "",
        );
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to continue.");
      }
    });
  }

  async function handlePasswordSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      if (lookup?.status !== "existing") {
        throw new Error("Enter an approved account email first.");
      }

      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: String(form.get("password") ?? ""),
      });

      if (error) {
        throw new Error(error.message);
      }

      router.push(RouteController.getDashboardPath(lookup.profile));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    }
  }

  function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await createPendingUserAccount({
          username: String(form.get("username") ?? ""),
          email,
          password: String(form.get("password") ?? ""),
          requestedProfileId: String(form.get("profileId") ?? ""),
        });

        setMessage(result.message);

        if (result.ok) {
          setStep("email");
          setLookup(null);
          event.currentTarget.reset();
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to create account.");
      }
    });
  }

  function resetFlow() {
    setLookup(null);
    setStep("email");
    setMessage("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF4EC] px-5 py-10 text-[#1d2520]">
      <section className="w-full max-w-md rounded-4xl border border-[#FFFFFF] bg-[#FFF4EC] p-6 shadow-2xl shadow-orange-300">
            {step === "email" ? (
              <form onSubmit={handleEmailLookup} className="space-y-5">
                <div>
                  <h2 className="flex justify-center text-2xl font-semibold">Log in</h2>
                </div>
                <Field label="Email" name="email" type="email" placeholder="name@example.com" />
                <SubmitButton label={isPending ? "Checking..." : "Continue"} />
                <Link href="/" className="flex justify-center text-sm font-semibold text-[#FFB347]">
                  Back to Home
                </Link>
              </form>
            ) : null}

            {step === "password" ? (
              <form onSubmit={handlePasswordSignIn} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold">Welcome back</h2>
                  <p className="mt-2 text-sm text-[#586158]">{email}</p>
                </div>
                <Field label="Password" name="password" type="password" placeholder="Password" />
                <SubmitButton label="Log In" />
                <button
                  type="button"
                  onClick={resetFlow}
                  className="flex w-full justify-center text-sm font-semibold text-[#FFB347]"
                >
                  Use another email
                </button>
              </form>
            ) : null}

            {step === "signup" ? (
              <form onSubmit={handleSignUp} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold">Create a pending account</h2>
                  <p className="mt-2 text-sm text-[#586158]">{email}</p>
                </div>
                <Field label="Username" name="username" placeholder="Your name" />
                <Field label="Password" name="password" type="password" placeholder="Password" />
                <label className="block text-sm font-medium">
                  Profile Type
                  <select
                    name="profileId"
                    disabled={!profiles.length}
                    className="mt-2 h-11 w-full rounded-md border border-[#cfc7b5] bg-white px-3 text-sm outline-none transition focus:border-[#1f5a46] focus:ring-2 focus:ring-[#1f5a46]/20"
                  >
                    {profiles.length ? (
                      profiles.map((profile) => (
                        <option key={profile.profileId} value={profile.profileId}>
                          {profile.profile}
                        </option>
                      ))
                    ) : (
                      <option value="">
                        No profiles available
                      </option>
                    )}
                  </select>
                </label>
                <SubmitButton label={isPending ? "Creating..." : "Create Account"} />
                <button
                  type="button"
                  onClick={resetFlow}
                  className="text-sm font-semibold text-[#1f5a46]"
                >
                  Use another email
                </button>
              </form>
            ) : null}

            {message ? (
              <p className="mt-5 rounded-md bg-[#f1e7d7] px-3 py-2 text-sm text-[#7d3f24]">
                {message}
              </p>
            ) : null}
      </section>
    </main>
  );
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
        className="mt-2 h-11 w-full rounded-md border border-[#cfc7b5] px-3 text-sm outline-none transition focus:border-[#1f5a46] focus:ring-2 focus:ring-[#1f5a46]/20"
        placeholder={placeholder}
      />
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button className="h-11 w-full rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]">
      {label}
    </button>
  );
}
