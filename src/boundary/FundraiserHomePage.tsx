import Link from "next/link";
import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import type { RecentDonationDTO } from "@/controller/FundraiserController";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function FundraiserHomePage({
  account,
  fraList,
  categoryList = [],
  recentDonations = [],
}: {
  account: UserAccountDTO;
  fraList: FRADTO[];
  categoryList?: FRACategoryDTO[];
  recentDonations?: RecentDonationDTO[];
}) {
  const profilePath = account.profile.profile.toLowerCase().replace(" ", "-");

  function getCategoryName(categoryId: string) {
    return (
      categoryList.find((category) => category.categoryId === categoryId)
        ?.categoryName ?? "Unknown Category"
    );
  }

  const activeFRAs = fraList.filter((fra) => fra.status === "active");
  const closedFRAs = fraList.filter((fra) => fra.status === "closed");
  const completedFRAs = fraList.filter((fra) => fra.status === "completed");

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <Header account={account} />

      <main className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9b5d12]">
          Fundraiser
        </p>

        <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>

        <p className="mt-1 text-[#6f6258]">
          Welcome back. Here is an overview of your fundraising activities.
        </p>

        <section className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard title="Total FRAs" value={String(fraList.length)} />
          <DashboardCard title="Active FRAs" value={String(activeFRAs.length)} />
          <DashboardCard title="Closed FRAs" value={String(closedFRAs.length)} />
          <DashboardCard
            title="Completed FRAs"
            value={String(completedFRAs.length)}
          />
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent FRAs</h2>

            <Link
              href={`/${profilePath}/my-fras`}
              className="text-sm font-semibold text-[#c77700] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {fraList.slice(0, 3).map((fra) => (
              <div
                key={fra.fraId}
                className="rounded-2xl border border-[#f0d8bd] bg-white/40 p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c77700]">
                      {getCategoryName(fra.categoryId)}
                    </p>

                    <h2 className="mt-2 min-h-[52px] line-clamp-2 text-xl font-bold leading-7">
                      {fra.title}
                    </h2>
                  </div>

                  <span
                    className={`flex h-7 w-32 items-center justify-center rounded-2xl px-4 text-xs font-bold uppercase tracking-[0.15em]
                      ${
                        fra.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : fra.status === "closed"
                            ? "bg-red-100 text-red-600"
                            : "bg-[#fff2df] text-[#c77700]"
                      }
                    `}
                  >
                    {fra.status}
                  </span>
                </div>

                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#fff2df]">
                  <div
                    className="h-full rounded-full bg-[#FFB347]"
                    style={{ width: `${fra.progressPercentage}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-sm font-semibold">
                  <p>${fra.currentAmount.toFixed(2)} raised</p>
                  <p>${fra.targetAmount.toFixed(2)} goal</p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#FFB347]">
                    {fra.progressPercentage}% funded
                  </p>

                  <p className="text-sm text-[#6f6258]">
                    {fra.viewCount} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">Recent Donations</h2>

          {recentDonations.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-[#f0d8bd] bg-white p-4 shadow-sm">
              <p className="text-[#6f6258]">No recent donations yet.</p>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {recentDonations.map((donation, index) => (
                <div
                  key={`${donation.fraId}-${donation.paydate}-${index}`}
                  className="rounded-2xl border border-[#f0d8bd] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{donation.username}</p>

                      <p className="mt-1 text-sm font-semibold text-[#c77700]">
                        {donation.fraTitle}
                      </p>
                    </div>

                    <p className="text-lg font-black text-[#c77700]">
                      ${donation.amount.toFixed(2)}
                    </p>
                  </div>

                  {donation.message ? (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6f6258]">
                      “{donation.message}”
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-[#6f6258]">
                      No message added.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#f0d8bd] bg-white/40 px-5 py-4 shadow-sm">
      <p className="text-sm text-[#6f6258]">{title}</p>
      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </div>
  );
}
