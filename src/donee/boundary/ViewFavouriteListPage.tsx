import Link from "next/link";
import { Header } from "@/components/Header";
import type { FavouriteDTO } from "@/entity/Favourite";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";
import { getFRAStatusClass } from "@/donee/boundary/fraStatusStyles";

// ViewFavouriteListPage
export function ViewFavouriteListPage({
  account,
  favouriteList,
  categories,
}: {
  account: UserAccountDTO;
  favouriteList: FavouriteDTO[];
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

  // displayFavouriteList(array[Favourite])
  const displayFavouriteList = (results: FavouriteDTO[]) => {
    if (!results.length) {
      return displayError("No favourite fundraising activities found.");
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((favourite) => {
          const fra = favourite.fra;

          if (!fra) {
            return null;
          }

          return (
            <article
              key={favourite.fav_id}
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
            <h1 className="mt-2 text-3xl font-bold">Favourites</h1>
          </div>

          <p className="pt-8 text-sm font-semibold text-[#6f6258]">
            {favouriteList.length} favourites
          </p>
        </div>

        <section className="mt-8">{displayFavouriteList(favouriteList)}</section>
      </main>
    </div>
  );
}
