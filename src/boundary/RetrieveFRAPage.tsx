"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { deleteFRAAction } from "@/controller/deleteFRAActions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export function RetrieveFRAPage({
  account,
  fra,
  categoryList = [],
}: {
  account: UserAccountDTO;
  fra: FRADTO;
  categoryList?: FRACategoryDTO[];
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

  function getCategoryName(categoryId: string) {
    return (
      categoryList.find((category) => category.categoryId === categoryId)
        ?.categoryName ?? "Unknown Category"
    );
  }

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
                  {getCategoryName(fra.categoryId)}
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
                type="button"
                onClick={handleDelete}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-8 h-4 w-full overflow-hidden rounded-full bg-[#fff2df]">
            <div
              className="h-full rounded-full bg-[#FFB347]"
              style={{ width: `${fra.progressPercentage}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-bold">
                ${fra.currentAmount.toFixed(2)}
              </p>

              <p className="text-sm text-[#6f6258]">
                raised of ${fra.targetAmount.toFixed(2)}
              </p>
            </div>

            <p className="text-lg font-bold text-[#c77700]">
              {fra.progressPercentage}% funded
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function getTimeLeft(endDate: string | null) {
  if (!endDate) {
    return {
      message: "No deadline",
      isExpired: false,
    };
  }

  const now = new Date();
  const deadline = new Date(endDate);
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      message: "Deadline passed",
      isExpired: true,
    };
  }

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (days > 0) {
    return {
      message: `${days} days ${hours} hours left`,
      isExpired: false,
    };
  }

  return {
    message: `${hours} hours ${minutes} minutes left`,
    isExpired: false,
  };
}