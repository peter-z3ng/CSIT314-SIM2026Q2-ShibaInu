"use client";

import { useEffect, useMemo, useState } from "react";
import type { FRADTO } from "@/entity/FRA";

export function DoneeFRASectionBoundary({ fraList }: { fraList: FRADTO[] }) {
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

  return (
    <section className="relative z-0 -mt-40 min-h-[60vh] rounded-[2rem] bg-[#FFF4EC] px-8 pb-10 pt-44">
      <h2 className="text-3xl font-black text-[#1d2520]">Highlighted Campaigns</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {visibleFRA.map((fra) => (
          <article key={fra.fraId} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
              {fra.status}
            </p>
            <h3 className="mt-3 text-xl font-black">{fra.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6f6258]">
              {fra.description ?? "No description added yet."}
            </p>
            <div className="mt-5">
              <div className="h-2 overflow-hidden rounded-full bg-[#ffe2bd]">
                <div
                  className="h-full rounded-full bg-[#FFB347]"
                  style={{ width: `${fra.progressPercentage}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-[#6f6258]">
                ${fra.currentAmount.toFixed(2)} raised of ${fra.targetAmount.toFixed(2)}
              </p>
            </div>
          </article>
        ))}

        {!visibleFRA.length ? (
          <p className="rounded-2xl bg-white p-5 text-sm text-[#6f6258] md:col-span-3">
            No fundraisers available yet.
          </p>
        ) : null}
      </div>
    </section>
  );
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
