"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { EmailLookupResult } from "@/controller/AuthController";
import { RouteController } from "@/controller/RouteController";
import { lookupEmail, submitRegistrationRequest } from "@/controller/authActions";
import type { Profile } from "@/entity/Profile";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LoginStep = "email" | "password" | "signup";

export function PublicLoginBoundary({ profiles }: { profiles: Profile[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<LoginStep>("email");
  const [lookup, setLookup] = useState<EmailLookupResult | null>(null);
  const [message, setMessage] = useState("");
  const email = lookup?.email ?? "";

  function handleEmailLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await lookupEmail(String(form.get("email") ?? ""));
        setLookup(result);
        setStep(result.status === "existing" ? "password" : "signup");
        setMessage(
          result.status === "pending"
            ? "Your registration request is waiting for admin approval."
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
        const result = await submitRegistrationRequest({
          username: String(form.get("username") ?? ""),
          email,
          requestedProfileId: String(form.get("profileId") ?? ""),
        });

        setMessage(result.message);

        if (result.ok) {
          setStep("email");
          setLookup(null);
          event.currentTarget.reset();
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to submit request.");
      }
    });
  }

  function resetFlow() {
    setLookup(null);
    setStep("email");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#1d2520]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-5 lg:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            ShibaInu Giving
          </Link>
          <Link href="/" className="text-sm font-semibold text-[#1f5a46]">
            Back to Home
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a5a2f]">
              Public Login
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
              Sign in with your approved account.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#586158]">
              New users submit a profile request first. Admins approve requests and create accounts.
            </p>
          </div>

          <div className="rounded-lg border border-[#dfdacd] bg-[#fffdf8] p-6 shadow-sm">
            {step === "email" ? (
              <form onSubmit={handleEmailLookup} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold">Enter your email</h2>
                  <p className="mt-2 text-sm leading-6 text-[#586158]">
                    Approved users continue with a password. New emails submit a request for admin approval.
                  </p>
                </div>
                <Field label="Email" name="email" type="email" placeholder="name@example.com" />
                <SubmitButton label={isPending ? "Checking..." : "Continue"} />
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
                  className="text-sm font-semibold text-[#1f5a46]"
                >
                  Use another email
                </button>
              </form>
            ) : null}

            {step === "signup" ? (
              <form onSubmit={handleSignUp} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold">Request an account</h2>
                  <p className="mt-2 text-sm text-[#586158]">{email}</p>
                </div>
                <Field label="Username" name="username" placeholder="Your name" />
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
                <SubmitButton label={isPending ? "Submitting..." : "Submit Request"} />
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
          </div>
        </section>
      </div>
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
    <button className="h-11 w-full rounded-md bg-[#1f5a46] px-4 text-sm font-semibold text-white transition hover:bg-[#174435]">
      {label}
    </button>
  );
}
