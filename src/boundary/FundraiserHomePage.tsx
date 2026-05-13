import Link from "next/link";
import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function FundraiserHomePage({
  account,
  fraList,
}: {
  account: UserAccountDTO;
  fraList: FRADTO[];
}) {
  const profilePath = account.profile.profile
    .toLowerCase()
    .replace(" ", "-");

  const totalViews = fraList.reduce(
    (total, fra) => total + fra.viewCount,
    0,
  );

  const activeFRAs = fraList.filter(
    (fra) => fra.status === "active",
  );

  const completedFRAs = fraList.filter(
    (fra) => fra.status === "completed",
  );

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

        <section className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Total FRAs"
            value={String(fraList.length)}
          />

          <DashboardCard
            title="Active FRAs"
            value={String(activeFRAs.length)}
          />

          <DashboardCard
            title="Completed FRAs"
            value={String(completedFRAs.length)}
          />

          <DashboardCard
            title="Total Views"
            value={String(totalViews)}
          />
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent FRAs</h2>

            <Link
              href={`/${profilePath}/my-fras`}
              className="text-sm font-semibold text-[#c77700] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fraList.slice(0, 3).map((fra) => (
              <div
                key={fra.fraId}
                className="rounded-2xl border border-[#f0d8bd] bg-white p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c77700]">
                      Education
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
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

                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#fff2df]">
                  <div
                    className="h-full rounded-full bg-[#FFB347]"
                    style={{
                      width: `${fra.progressPercentage}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-sm font-semibold">
                  <p>
                    ${fra.currentAmount.toFixed(2)} raised
                  </p>

                  <p>
                    ${fra.targetAmount.toFixed(2)} goal
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
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
    <div className="rounded-2xl border border-[#f0d8bd] bg-white px-6 py-5 shadow-sm">
      <p className="text-base text-[#6f6258]">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold">
        {value}
      </h2>
    </div>
  );
}
