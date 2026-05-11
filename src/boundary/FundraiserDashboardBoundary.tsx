import { Header } from "@/components/Header";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function FundraiserDashboardBoundary({
  account,
}: {
  account: UserAccountDTO;
}) {
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
            <h2 className="mt-2 text-3xl font-bold">8</h2>
          </div>

          <div className="rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6f6258]">Active FRAs</p>
            <h2 className="mt-2 text-3xl font-bold">5</h2>
          </div>

          <div className="rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6f6258]">Completed FRAs</p>
            <h2 className="mt-2 text-3xl font-bold">2</h2>
          </div>

          <div className="rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6f6258]">Total Views</p>
            <h2 className="mt-2 text-3xl font-bold">134</h2>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent FRAs</h2>

            <button className="text-sm font-semibold text-[#9b5d12] hover:underline">
              View all
            </button>
          </div>

          <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
            <div className="min-w-[320px] rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">Help Children Education</h3>

              <p className="mt-2 text-sm text-[#6f6258]">Status: Active</p>

              <p className="mt-1 text-sm text-[#6f6258]">
                Progress: $2,300 / $5,000
              </p>

              <p className="mt-1 text-sm text-[#6f6258]">Views: 52</p>
            </div>

            <div className="min-w-[320px] rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">Food Support for Families</h3>

              <p className="mt-2 text-sm text-[#6f6258]">
                Status: Completed
              </p>

              <p className="mt-1 text-sm text-[#6f6258]">
                Progress: $3,000 / $3,000
              </p>

              <p className="mt-1 text-sm text-[#6f6258]">Views: 82</p>
            </div>
          </div>
        </section>
        <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Donations</h2>

          <button className="text-sm font-semibold text-[#9b5d12] hover:underline">
            View all
          </button>
        </div>

        <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
          <div className="min-w-[320px] rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold">$50 Donation</h3>

            <p className="mt-2 text-sm text-[#6f6258]">
              FRA: Help Children Education
            </p>

            <p className="mt-1 text-sm text-[#6f6258]">
              Donor: Aung
            </p>

            <p className="mt-1 text-sm text-[#6f6258]">
              Date: 11 May 2026
            </p>
          </div>

          <div className="min-w-[320px] rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold">$100 Donation</h3>

            <p className="mt-2 text-sm text-[#6f6258]">
              FRA: Food Support for Families
            </p>

            <p className="mt-1 text-sm text-[#6f6258]">
              Donor: Mg Mg
            </p>

            <p className="mt-1 text-sm text-[#6f6258]">
              Date: 10 May 2026
            </p>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}