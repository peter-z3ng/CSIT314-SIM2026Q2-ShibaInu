import Link from "next/link";
import { Header } from "@/boundary/Header";
import type { DonationDTO } from "@/entity/Donation";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";
import { getFRAStatusClass } from "@/donee/boundary/fraStatusStyles";

// ViewDonationHistoryPage
export function ViewDonationHistoryPage({
  account,
  donations,
  categories,
}: {
  account: UserAccountDTO;
  donations: DonationDTO[];
  categories: FRACategoryDTO[];
}) {
  const profilePath = profileToPath(account.profile);

  function getCategoryName(categoryId: string) {
    return (
      categories.find((category) => category.categoryId === categoryId)?.categoryName ??
      "Unknown Category"
    );
  }

  // displayError(message)
  const displayError = (message: string) => (
    <div className="rounded-3xl border border-[#f0d8bd] bg-white/40 p-6 shadow-sm">
      <p className="text-[#6f6258]">{message}</p>
    </div>
  );

  // displayDonationHistory(array[Donation])
  const displayDonationHistory = (donationList: DonationDTO[]) => {
    if (!donationList.length) {
      return displayError("No donations found.");
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {donationList.map((donation) => {
          const fra = donation.fra;

          if (!fra) {
            return null;
          }

          return (
            <article
              key={donation.donationId ?? `${donation.fraId}-${donation.paydate}`}
              className="rounded-2xl border border-[#f0d8bd] bg-white/40 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c77700]">
                    {getCategoryName(fra.categoryId)}
                  </p>
                  <h2 className="mt-3 min-h-[64px] text-2xl font-bold leading-8">
                    {fra.title}
                  </h2>
                </div>

                <span
                  className={`flex h-8 w-36 items-center justify-center rounded-2xl px-4 text-xs font-bold uppercase tracking-[0.15em] ${getFRAStatusClass(
                    fra.status,
                  )}`}
                >
                  {fra.status}
                </span>
              </div>

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

              <Link
                href={`/${profilePath}/browse/${fra.fraId}`}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#FFB347] py-2.5 text-sm font-bold text-white transition hover:bg-[#FFBE5C]"
              >
                View details
              </Link>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <Header account={account} />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9b5d12]">
              Donee
            </p>
            <h1 className="mt-2 text-3xl font-bold">My Donations</h1>
          </div>

          <p className="pt-8 text-sm font-semibold text-[#6f6258]">
            {donations.length} donation{donations.length === 1 ? "" : "s"}
          </p>
        </div>

        <section className="mt-8">{displayDonationHistory(donations)}</section>
      </main>
    </div>
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
