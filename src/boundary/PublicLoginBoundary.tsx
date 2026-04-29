"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthController, type EmailLookupResult } from "@/controller/AuthController";
import { publicProfileOptions, type PublicProfileType } from "@/entity/UserAccount";

type LoginStep = "email" | "password" | "signup";

export function PublicLoginBoundary() {
  const router = useRouter();
  const controller = useMemo(() => new AuthController(), []);
  const [step, setStep] = useState<LoginStep>("email");
  const [lookup, setLookup] = useState<EmailLookupResult | null>(null);
  const [message, setMessage] = useState("");
  const email = lookup?.status === "new" ? lookup.email : lookup?.account.email ?? "";

  function handleEmailLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const result = controller.findPublicAccountByEmail(String(form.get("email") ?? ""));
      setLookup(result);
      setStep(result.status === "existing" ? "password" : "signup");
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to continue.");
    }
  }

  function handlePasswordSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const account = controller.signInPublicUser(email, String(form.get("password") ?? ""));
      router.push(controller.getDashboardPath(account.role));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    }
  }

  function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const account = controller.signUpPublicUser({
        username: String(form.get("username") ?? ""),
        email,
        password: String(form.get("password") ?? ""),
        role: String(form.get("role") ?? "donee") as PublicProfileType,
      });

      router.push(controller.getDashboardPath(account.role));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create account.");
    }
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
              Sign in as a donee, fundraiser, or platform management user.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#586158]">
              Admin login is kept separate and is not exposed from this public flow.
            </p>
          </div>

          <div className="rounded-lg border border-[#dfdacd] bg-[#fffdf8] p-6 shadow-sm">
            {step === "email" ? (
              <form onSubmit={handleEmailLookup} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold">Enter your email</h2>
                  <p className="mt-2 text-sm leading-6 text-[#586158]">
                    Existing users continue with a password. New emails continue to sign up.
                  </p>
                </div>
                <Field label="Email" name="email" type="email" placeholder="name@example.com" />
                <SubmitButton label="Continue" />
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
                  <h2 className="text-2xl font-semibold">Create your account</h2>
                  <p className="mt-2 text-sm text-[#586158]">{email}</p>
                </div>
                <Field label="Username" name="username" placeholder="Your name" />
                <Field label="Password" name="password" type="password" placeholder="Password" />
                <label className="block text-sm font-medium">
                  Profile Type
                  <select
                    name="role"
                    className="mt-2 h-11 w-full rounded-md border border-[#cfc7b5] bg-white px-3 text-sm outline-none transition focus:border-[#1f5a46] focus:ring-2 focus:ring-[#1f5a46]/20"
                  >
                    {publicProfileOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <SubmitButton label="Sign Up" />
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
