"use client";

import Link from "next/link";
import { useState } from "react";
import { RouteController } from "@/controller/RouteController";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";

export function Header({ account }: { account: UserAccountDTO }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profilePath = profileToPath(account.profile);
  const profileName = account.profile.profile.toLowerCase();

  const isFundraiser =
    profileName === "fundraiser" || profileName === "fund raiser";
  const isAdmin = profileName === "admin";
  const isDonee = profileName === "donee";
  const navLinks = [
    { label: "Home", href: `/${profilePath}/dashboard`, showHomeIcon: true },
    ...(isAdmin
      ? [
          { label: "Manage Accounts", href: `/${profilePath}/account` },
          { label: "Manage Profiles", href: `/${profilePath}/profile` },
        ]
      : []),
    ...(isDonee
      ? [
          { label: "Search", href: `/${profilePath}/browse` },
          { label: "My Donations", href: `/${profilePath}/donations` },
          { label: "Favourites", href: `/${profilePath}/favorites` },
        ]
      : []),
    ...(isFundraiser
      ? [
          { label: "My FRAs", href: `/${profilePath}/my-fras` },
          { label: "Completed FRAs", href: `/${profilePath}/completed-fras` },
        ]
      : []),
  ];

  return (
    <header className="border-b border-[#f0d8bd] bg-[#fffaf5]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link
          href={RouteController.getDashboardPath(account.profile)}
          className="text-lg font-bold"
        >
          Hope Spring
        </Link>

        <div className="flex items-center gap-3 justify-self-end">
          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((navLink) => (
              <Link
                key={navLink.href}
                href={navLink.href}
                className="flex items-center gap-2 whitespace-nowrap rounded-2xl px-3 py-2 text-md font-semibold text-[#1d2520] transition hover:bg-[#fff2df] hover:text-[#FFB347]"
              >
                {navLink.showHomeIcon ? <HomeIcon /> : null}
                {navLink.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Open profile menu"
            onClick={() => setIsMenuOpen(true)}
            className="flex size-10 items-center justify-center rounded-full text-[#00401A] transition hover:bg-[#fff2df]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
        </div>
      </div>

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
                  {account.profile.profile}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {account.username}
                </h2>

                <p className="mt-1 text-sm text-[#6f6258]">
                  {account.email}
                </p>
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
                href={`/${profilePath}/info`}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-[#1d2520] transition hover:bg-[#fff2df]"
              >
                My Profile
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
    </header>
  );
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="-translate-y-1 size-6.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125h4.125v-6.75h4.5V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"
      />
    </svg>
  );
}
