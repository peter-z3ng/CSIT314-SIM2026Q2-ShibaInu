"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthController } from "@/controller/AuthController";

export function AdminLoginBoundary() {
  const router = useRouter();
  const controller = useMemo(() => new AuthController(), []);
  const [message, setMessage] = useState("");

  function handleAdminSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const account = controller.signInAdmin(
        String(form.get("email") ?? ""),
        String(form.get("password") ?? ""),
      );

      router.push(controller.getDashboardPath(account.role));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    }
  }

  return (
    <main className="min-h-screen bg-[#171f1b] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-5 lg:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            ShibaInu Giving
          </Link>
          <Link href="/login" className="text-sm font-semibold text-[#d9c39f]">
            Public Login
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d9c39f]">
              Admin Access
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
              Admin login is separate from public users.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#c3cbc5]">
              Donee, fundraiser, and platform management accounts are rejected from this page.
            </p>
          </div>

          <form
            onSubmit={handleAdminSignIn}
            className="rounded-lg border border-white/10 bg-white p-6 text-[#1d2520] shadow-sm"
          >
            <h2 className="text-2xl font-semibold">Admin Log In</h2>
            <div className="mt-5 space-y-5">
              <Field label="Email" name="email" type="email" placeholder="admin@example.com" />
              <Field label="Password" name="password" type="password" placeholder="Password" />
            </div>
            <button className="mt-6 h-11 w-full rounded-md bg-[#171f1b] px-4 text-sm font-semibold text-white transition hover:bg-[#2a362f]">
              Log In
            </button>
            {message ? (
              <p className="mt-5 rounded-md bg-[#f1e7d7] px-3 py-2 text-sm text-[#7d3f24]">
                {message}
              </p>
            ) : null}
          </form>
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
        className="mt-2 h-11 w-full rounded-md border border-[#cfc7b5] px-3 text-sm outline-none transition focus:border-[#171f1b] focus:ring-2 focus:ring-[#171f1b]/20"
        placeholder={placeholder}
      />
    </label>
  );
}
