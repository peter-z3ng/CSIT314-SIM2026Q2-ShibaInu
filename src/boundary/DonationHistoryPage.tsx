import Link from "next/link";
import { Header } from "@/components/Header";
import type { DonationDTO } from "@/entity/Donation";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";

export function DonationHistoryPage({
  account,
  donations,
  categories,
}: {
  account: UserAccountDTO;
  donations: DonationDTO[];
  categories: FRACategoryDTO[];
}) {
  const profilePath = profileToPath(account.profile);
  const categoryNameById = new Map(
    categories.map((category) => [category.categoryId, category.categoryName]),
  );

  const displayError = (message: string) => (
    <p className="rounded-2xl bg-white p-5 text-sm text-[#6f6258] md:col-span-2 xl:col-span-3">
      {message}
    </p>
  );

  const displayDonationHistory = (donationList: DonationDTO[]) => {
    if (!donationList.length) {
      return displayError("No donations found.");
    }

    return donationList.map((donation) => {
      const fra = donation.fra;

      if (!fra) {
        return null;
      }

      return (
        <article
          key={donation.donationId ?? `${donation.fraId}-${donation.paydate}`}
          className="rounded-2xl bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
              {categoryNameById.get(fra.categoryId) ?? "General"}
            </p>
            <span className="rounded-md bg-[#fff2df] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#9b5d12]">
              {fra.status}
            </span>
          </div>
          <h2 className="mt-4 text-xl font-black">{fra.title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6f6258]">
            {fra.description ?? "No description added yet."}
          </p>
          <div className="mt-5 rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-4">
            <p className="text-sm font-bold text-[#1d2520]">
              You donated ${donation.amount.toFixed(2)}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#6f6258]">
              {formatDisplayDate(donation.paydate)}
            </p>
            {donation.message ? (
              <p className="mt-3 text-sm leading-6 text-[#6f6258]">{donation.message}</p>
            ) : null}
          </div>
          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-[#ffe2bd]">
              <div
                className="h-full rounded-full bg-[#FFB347]"
                style={{ width: `${fra.progressPercentage}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold text-[#6f6258]">
              <p>${fra.currentAmount.toFixed(2)} raised</p>
              <p>${fra.targetAmount.toFixed(2)} goal</p>
            </div>
          </div>
          <Link
            href={`/${profilePath}/browse/${fra.fraId}`}
            className="mt-5 flex h-10 w-full items-center justify-center rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
          >
            View details
          </Link>
        </article>
      );
    });
  };

  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#111111]">
      <Header account={account} />

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h1 className="mt-2 text-4xl font-black text-[#FFB347]">My Donations</h1>
            </div>
            <p className="text-sm font-semibold text-[#6f6258]">
              {donations.length} donation{donations.length === 1 ? "" : "s"} found
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {displayDonationHistory(donations)}
        </div>
      </section>
    </main>
  );
}

function formatDisplayDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}
