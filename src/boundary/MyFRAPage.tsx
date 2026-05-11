import Link from "next/link";
import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function MyFRAPage({
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
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9b5d12]">
              Fundraiser
            </p>
            <h1 className="mt-2 text-3xl font-bold">My FRAs</h1>
            <p className="mt-2 text-[#6f6258]">
              View and manage the fundraising activities you created.
            </p>
          </div>

          <Link
            href={`/${profilePath}/create-fra`}
            className="rounded-md bg-[#FFB347] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
          >
            Create FRA
          </Link>
        </div>

        <section className="mt-8">
          {fraList.length === 0 ? (
            <div className="rounded-2xl border border-[#f0d8bd] bg-white p-6 shadow-sm">
              <p className="text-[#6f6258]">No FRA found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {fraList.map((fra) => (
                <Link
                  key={fra.fraId}
                  href={`/${profilePath}/my-fras/${fra.fraId}`}
                  className="rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold">{fra.title}</h2>
                    <span className="rounded-full bg-[#fff2df] px-3 py-1 text-xs font-semibold text-[#9b5d12]">
                      {fra.status}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-[#6f6258]">
                    {fra.description || "No description provided."}
                  </p>

                  <div className="mt-4 grid gap-2 text-sm text-[#6f6258]">
                    <p>
                      Target: ${fra.targetAmount} | Current: ${fra.currentAmount}
                    </p>
                    <p>Progress: {fra.progressPercentage}%</p>
                    <p>
                      Views: {fra.viewCount} | Shortlisted: {fra.favCount}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}