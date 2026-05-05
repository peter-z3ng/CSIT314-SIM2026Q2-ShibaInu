"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DoneeFRASectionBoundary } from "@/boundary/DoneeFRASectionBoundary";
import { DoneeGlowSectionBoundary } from "@/boundary/DoneeGlowSectionBoundary";
import { DoneeHeaderBoundary } from "@/boundary/DoneeHeaderBoundary";
import type { FRADTO } from "@/entity/FRA";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function DoneeDashboardBoundary({
  account,
  totalDonated,
  fraList,
}: {
  account: UserAccountDTO;
  totalDonated: number;
  fraList: FRADTO[];
}) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#111111]">
      <DoneeHeaderBoundary account={account} />

      <div className="mx-auto max-w-[80vw] px-9 py-10">
        <section className="sticky top-6 z-0 aspect-[1920/748] overflow-hidden rounded-[2rem] bg-[#111111]">
          <Image
            src="/donee-wc.gif"
            alt="Donee welcome animation"
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
              <DoneePanelButton 
                href="/donee/browse"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                }
              >Browse</DoneePanelButton>
              <DoneePanelButton 
                href="/donee/donations"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
                }
              >My donations</DoneePanelButton>
              <DoneePanelButton href="/donee/favorites"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              }
              >Favorites</DoneePanelButton>
            </div>
          </div>
        </section>

        <DoneeGlowSectionBoundary totalDonated={totalDonated} />

        <DoneeFRASectionBoundary fraList={fraList} />
      </div>
    </main>
  );
}

function DoneePanelButton({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-12 w-40 items-center justify-center gap-3 rounded-4xl text-center text-md font-bold text-[#FFB347] shadow-lg transition hover:border border-[#FFBE5C]/40 hover:brightness-120"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
