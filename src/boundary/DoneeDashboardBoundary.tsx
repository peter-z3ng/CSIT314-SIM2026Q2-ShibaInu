"use client";

import Image from "next/image";
import { DoneeFRASectionBoundary } from "@/boundary/DoneeFRASectionBoundary";
import { DoneeGlowSectionBoundary } from "@/boundary/DoneeGlowSectionBoundary";
import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function DoneeDashboardBoundary({
  account,
  totalDonated,
  fraList,
  categoryList,
}: {
  account: UserAccountDTO;
  totalDonated: number;
  fraList: FRADTO[];
  categoryList: FRACategoryDTO[];
}) {
  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#111111]">
      <Header account={account} />

      <div className="mx-auto max-w-[80vw] px-9 py-10">
        <section className="sticky top-6 z-0 aspect-[1920/748] overflow-hidden rounded-[2rem] bg-[#111111]">
          <Image
            src="/donee-wc.gif"
            alt="Donee welcome animation"
            fill
            unoptimized
            className="object-contain"
          />
        </section>

        <DoneeGlowSectionBoundary totalDonated={totalDonated} />

        <DoneeFRASectionBoundary fraList={fraList} categoryList={categoryList} />
      </div>
    </main>
  );
}
