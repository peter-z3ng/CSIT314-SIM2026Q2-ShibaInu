"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { FRADTO } from "@/entity/FRA";
import type { FRACategoryDTO } from "@/entity/FRACategory";

// ViewCompletedFRAPage
export function ViewCompletedFRAPage({
  profilePath,
  fraList,
  categoryList = [],
  displayMessage,
}: {
  profilePath: string;
  fraList: FRADTO[];
  categoryList?: FRACategoryDTO[];
  displayMessage: (message: string) => ReactNode;
}) {
  function getCategoryName(categoryId: string) {
    return (
      categoryList.find((category) => category.categoryId === categoryId)?.categoryName ??
      "Unknown Category"
    );
  }

  // displayCompletedFRA(array[FRA])
  const displayCompletedFRA = (results: FRADTO[]) =>
    results.length === 0 ? (
      displayMessage("No completed FRA found.")
    ) : (
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((fra) => (
          <div
            key={fra.fraId}
            className="rounded-2xl border border-[#f0d8bd] bg-white/40 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c77700]">
                  {getCategoryName(fra.categoryId)}
                </p>

                <h2 className="mt-3 min-h-[64px] line-clamp-2 text-2xl font-bold leading-8">
                  {fra.title}
                </h2>
              </div>

              <span className="flex h-8 w-36 items-center justify-center rounded-2xl bg-green-100 px-4 text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                {fra.status}
              </span>
            </div>

            <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-[#fff2df]">
              <div
                className="h-full rounded-full bg-[#FFB347]"
                style={{ width: `${fra.progressPercentage}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-sm font-semibold">
              <p>${fra.currentAmount.toFixed(2)} raised</p>
              <p>${fra.targetAmount.toFixed(2)} goal</p>
            </div>

            <p className="mt-3 text-sm font-semibold text-[#FFB347]">
              {fra.progressPercentage}% funded
            </p>

            <Link
              href={`/${profilePath}/my-fras/${fra.fraId}`}
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#FFB347] py-2.5 text-sm font-bold text-white transition hover:bg-[#FFBE5C]"
            >
              View details
            </Link>
          </div>
        ))}
      </div>
    );

  return displayCompletedFRA(fraList);
}
