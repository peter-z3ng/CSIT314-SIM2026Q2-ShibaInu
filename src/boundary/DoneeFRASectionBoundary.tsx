"use client";

import { useEffect, useMemo, useState } from "react";
import type { FRADTO } from "@/entity/FRA";
import type { FRACategoryDTO } from "@/entity/FRACategory";

export function DoneeFRASectionBoundary({
  fraList,
  categoryList,
}: {
  fraList: FRADTO[];
  categoryList: FRACategoryDTO[];
}) {
  const [rotationKey, setRotationKey] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRotationKey((current) => current + 1);
    }, 60000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const visibleFRA = useMemo(() => {
    return shuffleFRA(fraList, rotationKey).slice(0, 3);
  }, [fraList, rotationKey]);

  function getCategoryName(categoryId: string) {
    return (
      categoryList.find((category) => category.categoryId === categoryId)?.categoryName ??
      "Unknown Category"
    );
  }

  return (
    <section className="relative z-0 -mt-40 min-h-[60vh] rounded-[2rem] bg-[#FFF4EC] px-8 pb-10 pt-44">
      <h2 className="text-3xl font-black text-[#1d2520]">Highlighted Fundraising Activities</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {visibleFRA.map((fra) => (
          <article
            key={fra.fraId}
            className="rounded-3xl border border-[#FFB347] bg-white/40 p-4 shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c77700]">
                  {getCategoryName(fra.categoryId)}
                </p>

                <h3 className="mt-3 min-h-[64px] line-clamp-2 text-2xl font-bold leading-8">
                  {fra.title}
                </h3>
              </div>

              <span
                className={`flex h-7 w-32 items-center justify-center rounded-2xl px-4 text-xs font-bold uppercase tracking-[0.15em] ${getFRAStatusClass(
                  fra.status,
                )}`}
              >
                {fra.status}
              </span>
            </div>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#fff2df]">
              <div
                className="h-full rounded-full bg-[#FFB347]"
                style={{ width: `${fra.progressPercentage}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-sm font-semibold">
              <p>${fra.currentAmount.toFixed(2)} raised</p>
              <p>${fra.targetAmount.toFixed(2)} goal</p>
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold text-[#FFB347]">
                {fra.progressPercentage}% funded
              </p>
            </div>
          </article>
        ))}

        {!visibleFRA.length ? (
          <p className="rounded-2xl bg-white/40 p-5 text-sm text-[#6f6258] md:col-span-3">
            No fundraisers available yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function getFRAStatusClass(status: string) {
  if (status === "completed") {
    return "bg-green-100 text-green-700";
  }

  if (status === "closed") {
    return "bg-red-100 text-red-600";
  }

  return "bg-[#fff2df] text-[#c77700]";
}

function shuffleFRA(fraList: FRADTO[], seed: number) {
  return [...fraList].sort((first, second) => {
    const firstScore = seededScore(first.fraId, seed);
    const secondScore = seededScore(second.fraId, seed);

    return firstScore - secondScore;
  });
}

function seededScore(value: string, seed: number) {
  let score = seed + 17;

  for (let index = 0; index < value.length; index += 1) {
    score = (score * 31 + value.charCodeAt(index)) % 9973;
  }

  return score;
}
