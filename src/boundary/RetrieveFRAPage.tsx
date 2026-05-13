"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { deleteFRAAction } from "@/controller/deleteFRAActions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function RetrieveFRAPage({
  account,
  fra,
}: {
  account: UserAccountDTO;
  fra: FRADTO;
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

  const displayStatus =
    timeLeft.isExpired && fra.status === "active"
      ? "closed"
      : fra.status;

  const isCompleted = displayStatus === "completed";

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FRA?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFRAAction(fra.fraId, account.userId);
      router.push(`/${profilePath}/my-fras`);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete FRA.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <Header account={account} />

      <main className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <Link
          href={
            isCompleted
              ? `/${profilePath}/completed-fras`
              : `/${profilePath}/my-fras`
          }
          className="text-sm font-semibold text-[#9b5d12] hover:underline"
        >
          ← Back to {isCompleted ? "Completed FRAs" : "My FRAs"}
        </Link>

        {isUpdated ? (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            FRA updated successfully.
          </div>
        ) : null}

        <section className="mt-6 rounded-3xl border border-[#f0d8bd] bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c77700]">
                  Education
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

              <h1 className="mt-4 text-4xl font-bold">{fra.title}</h1>

              <p className="mt-4 max-w-3xl text-lg text-[#6f6258]">
                {fra.description || "No description provided."}
              </p>

              {!isCompleted ? (
                <p className="mt-4 text-lg font-bold text-[#c77700]">
                  {timeLeft.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3">
              {!isCompleted ? (
                <Link
                  href={`/${profilePath}/my-fras/${fra.fraId}/update`}
                  className="rounded-2xl bg-[#FFB347] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#FFBE5C]"
                >
                  Edit FRA
                </Link>
              ) : null}

              <button
                onClick={handleDelete}
                className="flex items-center justify-center rounded-2xl border border-red-300 bg-red-50 px-5 py-3 text-red-600 transition hover:bg-red-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673A2.25 2.25 0 0 1 15.916 21H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-10">
            <div className="h-5 w-full overflow-hidden rounded-full bg-[#fff2df]">
              <div
                className="h-full rounded-full bg-[#FFB347]"
                style={{ width: `${fra.progressPercentage}%` }}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-2xl font-semibold">
              <p>${fra.currentAmount.toFixed(2)} raised</p>
              <p>${fra.targetAmount.toFixed(2)} goal</p>
            </div>

            <p className="mt-4 text-xl font-semibold text-[#FFB347]">
              {fra.progressPercentage}% funded
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-5">
            <div className="rounded-2xl border border-[#f0d8bd] p-5">
              <p className="text-sm text-[#6f6258]">Views</p>
              <h2 className="mt-2 text-3xl font-bold">{fra.viewCount}</h2>
            </div>

            <div className="rounded-2xl border border-[#f0d8bd] p-5">
              <p className="text-sm text-[#6f6258]">Shortlisted</p>
              <h2 className="mt-2 text-3xl font-bold">{fra.favCount}</h2>
            </div>

            <div className="rounded-2xl border border-[#f0d8bd] p-5">
              <p className="text-sm text-[#6f6258]">Start Date</p>
              <h2 className="mt-2 text-lg font-bold">
                {formatDateTime(fra.startDate)}
              </h2>
            </div>

            <div className="rounded-2xl border border-[#f0d8bd] p-5">
              <p className="text-sm text-[#6f6258]">End Date</p>
              <h2 className="mt-2 text-lg font-bold">
                {formatDateTime(fra.endDate)}
              </h2>
            </div>

            <div className="rounded-2xl border border-[#f0d8bd] p-5">
              <p className="text-sm text-[#6f6258]">Time Left</p>
              <h2 className="mt-2 text-lg font-bold">
                {isCompleted ? "Completed" : timeLeft.shortMessage}
              </h2>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function formatDateTime(date: string | null) {
  if (!date) {
    return "No date";
  }

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
    return {
      isExpired: false,
      message: "No deadline set.",
      shortMessage: "No deadline",
    };
  }

  const now = new Date().getTime();
  const deadline = new Date(endDate).getTime();
  const difference = deadline - now;

  if (difference <= 0) {
    return {
      isExpired: true,
      message: "Deadline has passed.",
      shortMessage: "Expired",
    };
  }

  const totalMinutes = Math.floor(difference / 1000 / 60);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  return {
    isExpired: false,
    message: `${days} days ${hours} hours ${minutes} minutes remaining until deadline.`,
    shortMessage: `${days}d ${hours}h ${minutes}m`,
  };
}
