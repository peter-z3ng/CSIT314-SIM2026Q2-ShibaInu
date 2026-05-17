"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/Header";
import type { UserAccountDTO } from "@/entity/UserAccount";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import { profileToPath } from "@/entity/UserProfile";

function PlatformPanelButton({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex w-[85%] items-center gap-3 rounded-2xl border border-[#FFB347]/40 bg-black/35 px-5 py-4 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:-translate-y-1 hover:bg-[#FFB347]/30"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export function PlatformManagementHomePage({
  account,
  categories,
  totalUsers,
}: {
  account: UserAccountDTO;
  categories: FRACategoryDTO[];
  totalUsers: number;
}) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const profilePath = profileToPath(account.profile);

  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#1d2520]">
      <Header account={account} />

      <div className="mx-auto max-w-[80vw] px-9 py-10">
        <section className="sticky top-6 z-0 aspect-[1920/748] overflow-hidden rounded-[2rem] bg-[#111111]">
          <Image
            src="/donee-wc.gif"
            alt="Platform management welcome animation"
            fill
            unoptimized
            className="object-contain"
          />

          <button
            type="button"
            aria-pressed={isPanelOpen}
            onClick={() => setIsPanelOpen((current) => !current)}
            className="absolute right-8 top-8 z-20 flex h-9 w-16 items-center rounded-full border border-white/55 bg-black/30 p-1 shadow-lg backdrop-blur-md transition hover:bg-black/40"
          >
            <span
              className={`h-7 w-7 rounded-full bg-[#FFB347] shadow-md transition-transform ${
                isPanelOpen ? "translate-x-0" : "translate-x-7"
              }`}
            />
          </button>

          <div
            className={`absolute right-[1%] mt-4 h-[60%] w-[20%] rounded-[2rem] border border-[#FFB347]/35 bg-gradient-to-r from-[#FFB347]/10 via-[#FFB347]/30 to-black/40 shadow-2xl backdrop-blur-xs transition duration-300 md:p-9 ${
              isPanelOpen
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-[110%] opacity-0"
            }`}
          >
            <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-18 flex-col items-center gap-4">
              <PlatformPanelButton
                href={`/${profilePath}/categories`}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.169.659 1.591l8.182 8.182a2.25 2.25 0 0 0 3.182 0l4.318-4.318a2.25 2.25 0 0 0 0-3.182L11.159 3.659A2.25 2.25 0 0 0 9.568 3Z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                  </svg>
                }
              >
                Category Management
              </PlatformPanelButton>

              <PlatformPanelButton
                href={`/${profilePath}/reports`}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125C16.5 3.504 17.004 3 17.625 3h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                  </svg>
                }
              >
                Reports
              </PlatformPanelButton>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-[#f0d8bd] bg-[#fffaf5] p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#6f6258]">Total Users</p>
            <h2 className="mt-3 text-4xl font-bold">{totalUsers}</h2>
          </div>

          <div className="rounded-3xl border border-[#f0d8bd] bg-[#fffaf5] p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#6f6258]">Total FRA Categories</p>
            <h2 className="mt-3 text-4xl font-bold">{categories.length}</h2>
          </div>
        </section>
      </div>
    </main>
  );
}
