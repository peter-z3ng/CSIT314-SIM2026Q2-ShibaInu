import Link from "next/link";
import { Header } from "@/components/Header";
import { SaveFavouritePage } from "@/boundary/SaveFavouritePage";
import type { DonationDTO } from "@/entity/Donation";
import type { FRADTO } from "@/entity/FRA";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";

export function FRADetailsPage({
  account,
  fra,
  categoryName,
  fundraiserUsername,
  previousFraId,
  nextFraId,
  recentDonations,
  isFavourite,
}: {
  account: UserAccountDTO;
  fra: FRADTO;
  categoryName: string;
  fundraiserUsername: string;
  previousFraId: string | null;
  nextFraId: string | null;
  recentDonations: DonationDTO[];
  isFavourite: boolean;
}) {
  const profilePath = profileToPath(account.profile);

  const displayFRADetails = (selectedFRA: FRADTO) => (
    <section className="mx-auto w-full px-6 py-10 lg:w-[60vw] lg:px-0">
      <h1 className="mb-6 text-3xl text-center font-black text-[#FFB347]">
        Fundraising Activity Details
      </h1>
      <div className="flex items-center justify-between gap-4">
        {previousFraId ? (
          <Link
            href={`/${profilePath}/browse/${previousFraId}`}
            className="flex items-center gap-1 text-sm font-semibold text-[#9b5d12] transition hover:text-[#FFB347]"
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
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            Previous
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-sm font-semibold text-[#c8ad8c]">
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
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            Previous
          </span>
        )}
        {nextFraId ? (
          <Link
            href={`/${profilePath}/browse/${nextFraId}`}
            className="flex items-center gap-1 text-sm font-semibold text-[#9b5d12] transition hover:text-[#FFB347]"
          >
            Next
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
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-sm font-semibold text-[#c8ad8c]">
            Next
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
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-[5fr_3fr]">
        <article className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
                  {categoryName}
                </p>
                <span className="w-fit rounded-md bg-[#fff2df] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#9b5d12]">
                  {selectedFRA.status}
                </span>
              </div>
              <h1 className="mt-3 text-4xl font-black text-[#111111]">
                {selectedFRA.title}
              </h1>
            </div>
            <div className="flex w-fit flex-col items-end gap-3">
              <SaveFavouritePage
                profilePath={profilePath}
                fra_id={selectedFRA.fraId}
                isSavedInitially={isFavourite}
              />
            </div>
          </div>

          <p className="mt-6 text-base leading-7 text-[#6f6258]">
            {selectedFRA.description ?? "No description added yet."}
          </p>

          <div className="mt-8">
            <div className="h-3 overflow-hidden rounded-full bg-[#ffe2bd]">
              <div
                className="h-full rounded-full bg-[#FFB347]"
                style={{ width: `${selectedFRA.progressPercentage}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-lg font-bold text-[#6f6258]">
              <p>${selectedFRA.currentAmount.toFixed(2)} raised</p>
              <p>${selectedFRA.targetAmount.toFixed(2)} goal</p>
            </div>
          </div>

          <div className="mt-8 min-h-[420px] flex flex-col justify-center gap-4">
            <DetailItem label="Start Date" value={formatDisplayDate(selectedFRA.startDate)} />
            <DetailItem
              label="End Date"
              value={selectedFRA.endDate ? formatDisplayDate(selectedFRA.endDate) : "_ _ _"}
            />
            <DetailItem label="Fundraiser" value={fundraiserUsername} />
            <button
              type="button"
              className="h-12 rounded-md bg-[#FFB347] px-4 text-sm font-bold text-white transition hover:bg-[#FFBE5C]"
            >
              Donate
            </button>
          </div>
        </article>

        <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          {/*
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
            Recent Donations
          </p>
          */}
          <h2 className="mt-3 text-2xl font-black text-[#111111]">Recent Donations</h2>
          {recentDonations.length ? (
            <div className="mt-6 grid gap-4">
              {recentDonations.map((donation, index) => (
                <article
                  key={`${donation.userId}-${donation.paydate}-${index}`}
                  className="rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-4"
                >
                  <p className="text-sm font-semibold text-[#1d2520]">
                    {donation.username} donated ${donation.amount.toFixed(2)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#6f6258]">
                    {donation.message?.trim() || "No message added."}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-4 text-sm font-semibold text-[#6f6258]">
              No donations yet.
            </p>
          )}
        </aside>
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#111111]">
      <Header account={account} />
      {displayFRADetails(fra)}
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-[#1d2520]">{value}</p>
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
