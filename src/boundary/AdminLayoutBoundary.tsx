"use client";

import Link from "next/link";
import { useState } from "react";
import { RouteController } from "@/controller/RouteController";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function AdminLayoutBoundary({
  account,
  title,
  eyebrow,
  children,
}: {
  account: UserAccountDTO;
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#1d2520]">
      <header className="border-b border-[#f0d8bd] bg-[#fffaf5]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-6">
              Hope Spring
            <nav className="hidden flex-wrap gap-3 md:flex">
              <Link href="/admin/dashboard" className="rounded-md bg-[#FFB347] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]">
                All User Account
              </Link>
              <Link href="/admin/account" className="rounded-md bg-[#FFB347] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]">
                Create Account
              </Link>
              <Link href="/admin/profile" className="rounded-md bg-[#FFB347] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]">
                Create Profile
              </Link>
            </nav>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="ml-auto rounded-2xl px-3 py-1 text-xl font-semibold text-[#00401A] cursor-pointer transition hover:bg-[#fff2df]"
          >
            {account.username}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9b5d12]">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold">{title}</h1>
        </div>
        {children}
      </section>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 bg-black/30"
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-[#fffaf5] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#f0d8bd] pb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9b5d12]">
                  Admin
                </p>
                <h2 className="mt-1 text-2xl font-bold">{account.username}</h2>
                <p className="mt-1 text-sm text-[#6f6258]">{account.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md border border-[#f0c48a] px-3 py-1.5 text-sm font-semibold text-[#9b5d12] transition hover:bg-[#fff2df]"
              >
                Close
              </button>
            </div>

            <nav className="mt-5 grid gap-3">
              <Link
                href="/admin/info"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-[#1d2520] transition hover:bg-[#fff2df]"
              >
                Edit Info
              </Link>
            </nav>

            <div className="mt-auto border-t border-[#f0d8bd] pt-4">
              <Link
                href={RouteController.getLogoutPath(account.profile)}
                className="flex h-11 w-full items-center justify-center rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
              >
                Log Out
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
