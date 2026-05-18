"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/boundary/Header";
import { DeleteFRAPage } from "@/fundraiser/boundary/DeleteFRAPage";
import { ViewFRACountPage } from "@/fundraiser/boundary/ViewFRACountPage";
import { ViewFRAShortlistedPage } from "@/fundraiser/boundary/ViewFRAShortlistedPage";
import type { FRADTO } from "@/entity/FRA";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import type { DonationDTO } from "@/entity/Donation";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { deleteFRAAction } from "@/controller/deleteFRAActions";

// RetrieveFRAPage
export function RetrieveFRAPage({
  account,
  fra,
  viewCount,
  shortlistedCount,
  categoryList = [],
  recentDonations = [],
}: {
  account: UserAccountDTO;
  fra: FRADTO;
  viewCount: number;
  shortlistedCount: number;
  categoryList?: FRACategoryDTO[];
  recentDonations?: DonationDTO[];
}) {
  const profilePath = account.profile.profile.toLowerCase().replace(" ", "-");
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpdated = searchParams.get("updated");

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(fra.endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(fra.endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [fra.endDate]);

  const displayStatus = timeLeft.isExpired && fra.status === "active" ? "closed" : fra.status;

  const isCompleted = displayStatus === "completed";

  const categoryName =
    categoryList.find((category) => category.categoryId === fra.categoryId)?.categoryName ??
    "Unknown Category";

  // selectFRA(fra_id)
  const selectFRA = (fra_id: string): FRADTO | null => (fra.fraId === fra_id ? fra : null);

  // displayError()
  const displayError = () => (
    <div className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <Header account={account} />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="rounded-3xl border border-[#f0d8bd] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-[#9b5d12]">Unable to retrieve FRA details.</p>
        </div>
      </main>
    </div>
  );

  // displayFRADetails()
  const displayFRADetails = () => (
    <div className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <Header account={account} />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <Link
          href={isCompleted ? `/${profilePath}/completed-fras` : `/${profilePath}/my-fras`}
          className="text-sm font-semibold text-[#9b5d12] hover:underline"
        >
          ← Back to {isCompleted ? "Completed FRAs" : "My FRAs"}
        </Link>

        {isUpdated ? (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            FRA updated successfully.
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <article className="rounded-3xl border border-[#f0d8bd] bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c77700]">
                {categoryName}
              </p>

              <span
                className={`flex h-10 w-36 items-center justify-center rounded-2xl px-4 text-xs font-bold uppercase tracking-[0.15em]
                  ${
                    displayStatus === "completed"
                      ? "bg-green-100 text-green-700"
                      : displayStatus === "closed"
                        ? "bg-red-100 text-red-600"
                        : "bg-[#fff2df] text-[#c77700]"
                  }
                `}
              >
                {displayStatus}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-bold">{fra.title}</h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6f6258]">
              {fra.description || "No description provided."}
            </p>

            {!isCompleted ? (
              <p className="mt-5 text-lg font-bold text-[#c77700]">{timeLeft.message}</p>
            ) : null}

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <ViewFRACountPage fraId={fra.fraId} viewCount={viewCount} />
              <ViewFRAShortlistedPage
                fraId={fra.fraId}
                shortlistedCount={shortlistedCount}
              />
              <DetailCard label="Start Date" value={formatDateTime(fra.startDate)} />
              <DetailCard label="End Date" value={formatDateTime(fra.endDate)} />
            </div>
          </article>

          <aside className="h-fit rounded-3xl border border-[#f0d8bd] bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="flex justify-end gap-3">
              {!isCompleted ? (
                <Link
                  href={`/${profilePath}/my-fras/${fra.fraId}/update`}
                  className="rounded-2xl bg-[#FFB347] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#FFBE5C]"
                >
                  Edit FRA
                </Link>
              ) : null}

              <DeleteFRAPage
                fraId={fra.fraId}
                fraTitle={fra.title}
                userId={account.userId}
                deleteFRAAction={deleteFRAAction}
                onDeleted={() => router.push(`/${profilePath}/my-fras`)}
              />
            </div>

            <div className="mt-6">
              <h2 className="text-4xl font-black">${fra.currentAmount.toFixed(2)}</h2>

              <p className="mt-1 text-lg text-[#6f6258]">
                raised of ${fra.targetAmount.toFixed(2)}
              </p>

              <div className="mt-5 h-4 overflow-hidden rounded-full bg-[#fff2df]">
                <div
                  className="h-full rounded-full bg-[#FFB347]"
                  style={{ width: `${fra.progressPercentage}%` }}
                />
              </div>

              <p className="mt-3 text-lg font-bold text-[#c77700]">
                {fra.progressPercentage}% funded
              </p>
            </div>

            <div className="mt-8 border-t border-[#f0d8bd] pt-5">
              <h3 className="text-lg font-bold">Recent Donations</h3>

              {recentDonations.length === 0 ? (
                <p className="mt-3 text-sm text-[#6f6258]">No recent donations yet.</p>
              ) : (
                <div className="mt-4 grid gap-4">
                  {recentDonations.slice(0, 3).map((donation, index) => (
                    <div
                      key={`${donation.userId}-${donation.paydate}-${index}`}
                      className="rounded-2xl bg-[#fffaf5] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold">{donation.username || "Anonymous"}</p>

                        <p className="text-sm font-bold text-[#c77700]">
                          ${Number(donation.amount).toFixed(2)}
                        </p>
                      </div>

                      {donation.message ? (
                        <p className="mt-2 text-sm text-[#6f6258]">“{donation.message}”</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>

    </div>
  );

  return selectFRA(fra.fraId) ? displayFRADetails() : displayError();
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#f0d8bd] bg-[#fffaf5] p-5">
      <p className="text-sm text-[#6f6258]">{label}</p>
      <h2 className="mt-2 text-xl font-bold">{value}</h2>
    </div>
  );
}

function formatDateTime(date: string | null) {
  if (!date) return "No date";

  return new Date(date)
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replaceAll("/", "-");
}

function getTimeLeft(endDate: string | null) {
  if (!endDate) {
    return { message: "No deadline", isExpired: false };
  }

  const diff = new Date(endDate).getTime() - new Date().getTime();

  if (diff <= 0) {
    return { message: "Deadline passed", isExpired: true };
  }

  const totalMinutes = Math.floor(diff / 1000 / 60);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  return {
    message: `${days} days ${hours} hours ${minutes} minutes left`,
    isExpired: false,
  };
}
