import Link from "next/link";
import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function CompletedFRAPage({
  account,
  fraList,
}: {
  account: UserAccountDTO;
  fraList: FRADTO[];
}) {
  const profilePath = account.profile.profile.toLowerCase().replace(" ", "-");

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <Header account={account} />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9b5d12]">
          Fundraiser
        </p>

        <h1 className="mt-2 text-3xl font-bold">Completed FRAs</h1>

        <p className="mt-2 text-[#6f6258]">
          View your completed fundraising activities.
        </p>
        <form className="mt-8 grid gap-4 rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm md:grid-cols-4">
            <input
                name="keyword"
                placeholder="Search by title"
                className="rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
            />

            <input
                name="categoryId"
                placeholder="Category ID"
                className="rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
            />

            <input
                type="date"
                name="startDate"
                className="rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
            />

            <input
                type="date"
                name="endDate"
                className="rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
            />

            <button
                type="submit"
                className="rounded-md bg-[#FFB347] px-5 py-3 font-semibold text-white transition hover:bg-[#FFBE5C] md:col-span-4"
            >
                Search Completed FRAs
            </button>
            </form>
        <section className="mt-8">
          {fraList.length === 0 ? (
            <div className="rounded-2xl border border-[#f0d8bd] bg-white p-6 shadow-sm">
              <p className="text-[#6f6258]">No completed FRA found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {fraList.map((fra) => (
                <div
                  key={fra.fraId}
                  className="rounded-2xl border border-[#f0d8bd] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c77700]">
                        Education
                      </p>

                      <h2 className="mt-3 text-2xl font-bold">{fra.title}</h2>
                    </div>

                    <span
                    className={`flex h-8 w-30 items-center justify-center rounded-2xl px-4 text-xs font-bold uppercase tracking-[0.15em]
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


                  <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-[#fff2df]">
                    <div
                      className="h-full rounded-full bg-[#FFB347]"
                      style={{ width: `${fra.progressPercentage}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm font-semibold">
                    <p>${fra.currentAmount.toFixed(2)} raised</p>
                    <p>${fra.targetAmount.toFixed(2)} goal</p>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-[#FFB347]">
                    {fra.progressPercentage}% funded
                  </p>


                  <Link
                    href={`/${profilePath}/my-fras/${fra.fraId}`}
                    className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#FFB347] py-2.5 text-sm font-bold text-white transition hover:bg-[#FFBE5C]"
                  >
                    View details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}