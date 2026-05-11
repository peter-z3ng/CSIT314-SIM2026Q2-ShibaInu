import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function FundraiserDashboardBoundary({
  account,
  fraList,
}: {
  account: UserAccountDTO;
  fraList: FRADTO[];
}) {
  const totalFRAs = fraList.length;
  const activeFRAs = fraList.filter(
    (fra) => fra.status.toLowerCase() === "active",
  ).length;
  const completedFRAs = fraList.filter(
    (fra) => fra.status.toLowerCase() === "completed",
  ).length;
  const totalViews = fraList.reduce(
    (total, fra) => total + fra.viewCount,
    0,
  );

  const recentFRAs = fraList.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <Header account={account} />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9b5d12]">
          Fundraiser
        </p>

        <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>

        <p className="mt-2 text-[#6f6258]">
          Welcome back. Here is an overview of your fundraising activities.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6f6258]">Total FRAs</p>
            <h2 className="mt-2 text-3xl font-bold">{totalFRAs}</h2>
          </div>

          <div className="rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6f6258]">Active FRAs</p>
            <h2 className="mt-2 text-3xl font-bold">{activeFRAs}</h2>
          </div>

          <div className="rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6f6258]">Completed FRAs</p>
            <h2 className="mt-2 text-3xl font-bold">{completedFRAs}</h2>
          </div>

          <div className="rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6f6258]">Total Views</p>
            <h2 className="mt-2 text-3xl font-bold">{totalViews}</h2>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent FRAs</h2>

            <a
              href={`/${account.profile.profile.toLowerCase().replace(" ", "-")}/my-fras`}
              className="text-sm font-semibold text-[#9b5d12] hover:underline"
            >
              View all
            </a>
          </div>

          {recentFRAs.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
              <p className="text-[#6f6258]">No recent FRA found.</p>
            </div>
          ) : (
            <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
              {recentFRAs.map((fra) => (
                <div
                  key={fra.fraId}
                  className="min-w-[320px] rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm"
                >
                  <h3 className="text-lg font-bold">{fra.title}</h3>

                  <p className="mt-2 text-sm text-[#6f6258]">
                    Status: {fra.status}
                  </p>

                  <p className="mt-1 text-sm text-[#6f6258]">
                    Progress: ${fra.currentAmount} / ${fra.targetAmount}
                  </p>

                  <p className="mt-1 text-sm text-[#6f6258]">
                    Views: {fra.viewCount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}