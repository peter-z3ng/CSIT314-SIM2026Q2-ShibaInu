"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { deleteFRAAction } from "@/controller/deleteFRAActions";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function RetrieveFRAPage({
  account,
  fra,
}: {
  account: UserAccountDTO;
  fra: FRADTO;
}) {
  const profilePath = account.profile.profile.toLowerCase().replace(" ", "-");
  const router = useRouter();
    async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FRA?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFRAAction(
        fra.fraId,
        account.userId,
      );

      router.push(`/${profilePath}/my-fras`);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete FRA.",
      );
    }
  }

const formatDate = (date: string | null) => {
  if (!date) {
    return "No date";
  }

  return new Date(date)
    .toLocaleDateString("en-GB")
    .replaceAll("/", "-");
};

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <Header account={account} />

      <main className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <Link
          href={`/${profilePath}/my-fras`}
          className="text-sm font-semibold text-[#9b5d12] hover:underline"
        >
          ← Back to My FRAs
        </Link>

        <section className="mt-6 rounded-3xl border border-[#f0d8bd] bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c77700]">
                  Education
                </p>

                <span className="rounded-2xl bg-[#fff2df] px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[#c77700]">
                  {fra.status}
                </span>
              </div>

              <h1 className="mt-4 text-4xl font-bold">{fra.title}</h1>

              <p className="mt-4 max-w-3xl text-lg text-[#6f6258]">
                {fra.description || "No description provided."}
              </p>
            </div>

            <div className="flex flex-col gap-3">
            <Link
                href={`/${profilePath}/my-fras/${fra.fraId}/update`}
                className="rounded-2xl bg-[#FFB347] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#FFBE5C]"
            >
                Edit FRA
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center rounded-2xl border border-red-300 bg-red-50 px-5 py-3 text-red-600 transition hover:bg-red-100"
            >
              <Trash2 size={18} />
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

          <div className="mt-10 grid gap-4 md:grid-cols-4">
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
              <h2 className="mt-2 text-lg font-bold">{formatDate(fra.startDate)}</h2>
            </div>

            <div className="rounded-2xl border border-[#f0d8bd] p-5">
              <p className="text-sm text-[#6f6258]">End Date</p>
              <h2 className="mt-2 text-lg font-bold">
                {formatDate(fra.endDate)}
              </h2>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}