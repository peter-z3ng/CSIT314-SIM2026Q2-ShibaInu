import Link from "next/link";
import { Header } from "@/boundary/Header";
import { DonatePage } from "@/boundary/DonatePage";
import { SaveFavouritePage } from "@/donee/boundary/SaveFavouritePage";
import type { DonationDTO } from "@/entity/Donation";
import type { FRADTO } from "@/entity/FRA";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";
import { getFRAStatusClass } from "@/donee/boundary/fraStatusStyles";

// ViewFRADetailsPage
export function ViewFRADetailsPage({
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
  const isDonee = account.profile.profile.toLowerCase() === "donee";
  const canDonate = fra.status === "active";

  // displayFRADetails(...)
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
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
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
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
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-[5fr_3fr]">
        <article className="rounded-[2rem] border border-[#FFB347] bg-white/30 p-6 shadow-md md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
                  {categoryName}
                </p>
                <span
                  className={`w-fit rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] ${getFRAStatusClass(
                    selectedFRA.status,
                  )}`}
                >
                  {selectedFRA.status}
                </span>
              </div>
              <h1 className="mt-3 text-4xl font-black text-[#111111]">{selectedFRA.title}</h1>
            </div>
            <div className="flex w-fit flex-col items-end gap-3">
              <SaveFavouritePage
                profilePath={profilePath}
                user_id={account.userId}
                fra_id={selectedFRA.fraId}
                isSavedInitially={isFavourite}
              />
            </div>
          </div>

          <p className="mt-6 text-base leading-7 text-[#6f6258]">
            {selectedFRA.description ?? "No description added yet."}
          </p>

          <p className="mt-4 text-md font-black text-[#c77700]">
              {getTimeLeftLabel(selectedFRA.endDate)}
          </p>

          <div className="mt-8 min-h-[420px] flex flex-col justify-center gap-4">
            <DetailItem label="Start Date" value={formatDisplayDate(selectedFRA.startDate)} />
            <DetailItem
              label="End Date"
              value={selectedFRA.endDate ? formatDisplayDate(selectedFRA.endDate) : "_ _ _"}
            />
            <DetailItem label="Fundraiser" value={fundraiserUsername} />
            {isDonee ? (
              <DonatePage
                profilePath={profilePath}
                fra_id={selectedFRA.fraId}
                fraTitle={selectedFRA.title}
                disabled={!canDonate}
                disabledReason="Donations are only available for active FRAs."
              />
            ) : null}
            <Link
              href={`/${profilePath}/browse`}
              className="text-sm text-center font-semibold text-[#9b5d12] hover:underline"
            >
              Back
            </Link>
          </div>

          
        </article>

        <aside className="h-fit rounded-[2rem] bg-white/30 p-6 shadow-md md:p-8">
          <section>
            <p className="text-5xl font-black text-[#1d2520]">
              ${selectedFRA.currentAmount.toFixed(2)}
            </p>
            <p className="mt-2 text-xl text-[#6f6258]">
              raised of ${selectedFRA.targetAmount.toFixed(2)}
            </p>

            <div className="mt-8 h-4 overflow-hidden rounded-full bg-[#fff2df]">
              <div
                className="h-full rounded-full bg-[#FFB347]"
                style={{ width: `${selectedFRA.progressPercentage}%` }}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-lg font-black text-[#c77700]">
                {selectedFRA.progressPercentage}% funded
              </p>
            </div>
          </section>

          <section className="mt-10 border-t border-[#f0d8bd] pt-8">
            <h2 className="text-xl font-black text-[#111111]">Recent Donations</h2>
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
                No recent donations yet.
              </p>
            )}
          </section>
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
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">{label}</p>
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

function getTimeLeftLabel(endDate: string | null) {
  if (!endDate) {
    return "No end date";
  }

  const end = new Date(endDate);

  if (Number.isNaN(end.getTime())) {
    return "No end date";
  }

  const millisecondsLeft = end.getTime() - Date.now();

  if (millisecondsLeft <= 0) {
    return "Ended";
  }

  const totalMinutesLeft = Math.floor(millisecondsLeft / (1000 * 60));
  const daysLeft = Math.floor(totalMinutesLeft / (60 * 24));
  const hoursLeft = Math.floor((totalMinutesLeft % (60 * 24)) / 60);
  const minutesLeft = totalMinutesLeft % 60;

  const dayLabel = `${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
  const hourLabel = `${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}`;
  const minuteLabel = `${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}`;

  return `${dayLabel} ${hourLabel} ${minuteLabel} left`;
}
