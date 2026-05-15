"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RouteController } from "@/controller/RouteController";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";
import { ProfileSidePanel } from "@/components/ProfileSidePanel";

export function Header({ account }: { account: UserAccountDTO }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const profilePath = profileToPath(account.profile);
  const profileName = account.profile.profile.toLowerCase();

  const isFundraiser =
    profileName === "fundraiser" || profileName === "fund raiser";
  const isAdmin = profileName === "admin";
  const isDonee = profileName === "donee";
  const navLinks = [
    ...(!isAdmin
      ? [{ label: "Home", href: `/${profilePath}/dashboard`, showHomeIcon: true }]
      : []),
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
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <span className="text-md font-semibold text-[#1d2520]">Manage</span>
                <div className="flex rounded-2xl border border-[#f0d8bd] bg-white p-1">
                  {[
                    { label: "Accounts", href: `/${profilePath}/account` },
                    { label: "Profiles", href: `/${profilePath}/profile` },
                  ].map((navLink) => {
                    const isActive = pathname === navLink.href;

                    return (
                      <Link
                        key={navLink.href}
                        href={navLink.href}
                        className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-md font-semibold transition ${
                          isActive
                            ? "bg-[#fff2df] text-[#9b5d12]"
                            : "text-[#1d2520] hover:bg-[#fff2df] hover:text-[#FFB347]"
                        }`}
                      >
                        {navLink.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              navLinks.map((navLink) => (
                <Link
                  key={navLink.href}
                  href={navLink.href}
                  className="flex items-center gap-2 whitespace-nowrap rounded-2xl px-3 py-2 text-md font-semibold text-[#1d2520] transition hover:bg-[#fff2df] hover:text-[#FFB347]"
                >
                  {navLink.showHomeIcon ? <HomeIcon /> : null}
                  {navLink.label}
                </Link>
              ))
            )}
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

          <ProfileSidePanel
            account={account}
            onClose={() => setIsMenuOpen(false)}
          />
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
