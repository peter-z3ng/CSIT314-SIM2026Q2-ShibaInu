import Link from "next/link";
import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";

export function FRADetailsPage({
  account,
  fra,
}: {
  account: UserAccountDTO;
  fra: FRADTO;
}) {
  const profilePath = profileToPath(account.profile);

  const displayFRADetails = (selectedFRA: FRADTO) => (
    <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
      <Link
        href={`/${profilePath}/browse`}
        className="text-sm font-semibold text-[#9b5d12] transition hover:text-[#FFB347]"
      >
        Back to browse
      </Link>

      <article className="mt-5 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
              Category ID: {selectedFRA.categoryId}
            </p>
            <h1 className="mt-3 text-4xl font-black text-[#111111]">
              {selectedFRA.title}
            </h1>
          </div>
          <span className="w-fit rounded-md bg-[#fff2df] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#9b5d12]">
            {selectedFRA.status}
          </span>
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
          <p className="mt-3 text-lg font-bold text-[#6f6258]">
            ${selectedFRA.currentAmount.toFixed(2)} raised of $
            {selectedFRA.targetAmount.toFixed(2)}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <DetailItem label="Start Date" value={selectedFRA.startDate} />
          <DetailItem label="End Date" value={selectedFRA.endDate ?? "No end date"} />
          <DetailItem label="Views" value={String(selectedFRA.viewCount)} />
          <DetailItem label="Favorites" value={String(selectedFRA.favCount)} />
          <DetailItem label="Created At" value={selectedFRA.createdAt} />
          <DetailItem label="Updated At" value={selectedFRA.updatedAt ?? "Not updated"} />
        </div>
      </article>
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
