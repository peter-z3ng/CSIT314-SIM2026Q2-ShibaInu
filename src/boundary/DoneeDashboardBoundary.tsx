"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DoneeGlowSectionBoundary } from "@/boundary/DoneeGlowSectionBoundary";
import { DoneeHeaderBoundary } from "@/boundary/DoneeHeaderBoundary";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function DoneeDashboardBoundary({ account }: { account: UserAccountDTO }) {
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
            className={`absolute right-[1%] mt-4 h-[60%] w-[16%] rounded-[2rem] border border-[#FFB347]/35 bg-gradient-to-r from-[#FFB347]/10 via-[#FFB347]/30 to-black/40 shadow-2xl backdrop-blur-xs transition duration-300 md:p-9 ${
              isPanelOpen
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-[110%] opacity-0"
            }`}
          >
            <div className="flex h-full flex-col justify-end gap-3">
              <DoneePanelButton href="/donee/browse">Browse</DoneePanelButton>
              <DoneePanelButton href="/donee/donations">My donations</DoneePanelButton>
              <DoneePanelButton href="/donee/favorites">Favorites</DoneePanelButton>
            </div>
          </div>
        </section>

        <DoneeGlowSectionBoundary />

        <section className="relative z-0 -mt-40 min-h-[60vh] rounded-[2rem] bg-gradient-to-b from-[#FFF4EC] from-80% to-[#FFB347]/80 to-95%" />
      </div>
    </main>
  );
}

function DoneePanelButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-11 items-center justify-center rounded-xl border border-[#FFB347]/50 bg-[#FFB347] px-3 text-center text-sm font-bold text-white shadow-lg transition hover:bg-[#FFBE5C]"
    >
      {children}
    </Link>
  );
}
