"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";

export function SearchFRAPage({
  account,
  fraList,
  categories,
}: {
  account: UserAccountDTO;
  fraList: FRADTO[];
  categories: FRACategoryDTO[];
}) {
  const [keyword, setKeyword] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const profilePath = profileToPath(account.profile);

  const categoryNameById = useMemo(() => {
    return new Map(categories.map((category) => [category.categoryId, category.categoryName]));
  }, [categories]);

  const filteredFRA = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return fraList.filter((fra) => {
      const categoryName = categoryNameById.get(fra.categoryId);
      const matchesKeyword =
        !normalizedKeyword ||
        fra.title.toLowerCase().includes(normalizedKeyword) ||
        (fra.description?.toLowerCase().includes(normalizedKeyword) ?? false) ||
        (categoryName?.toLowerCase().includes(normalizedKeyword) ?? false);

      const matchesCategory = selectedCategoryId === "all" || fra.categoryId === selectedCategoryId;

      return matchesKeyword && matchesCategory;
    });
  }, [categoryNameById, fraList, keyword, selectedCategoryId]);

  const hasFilters = keyword.trim() !== "" || selectedCategoryId !== "all";

  const clearFilters = () => {
    setKeyword("");
    setSelectedCategoryId("all");
  };

  const displayError = (message: string) => (
    <p className="rounded-2xl bg-white p-5 text-sm text-[#6f6258] md:col-span-2 xl:col-span-3">
      {message}
    </p>
  );

  const displayFRASearchResults = (results: FRADTO[]) => {
    if (!results.length) {
      return displayError("No matching fundraising activities found.");
    }

    return results.map((fra) => (
      <article key={fra.fraId} className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
            {categoryNameById.get(fra.categoryId) ?? "General"}
          </p>
          <span className="rounded-md bg-[#fff2df] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#9b5d12]">
            {fra.status}
          </span>
        </div>
        <h2 className="mt-4 text-xl font-black">{fra.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6f6258]">
          {fra.description ?? "No description added yet."}
        </p>
        <div className="mt-5">
          <div className="h-2 overflow-hidden rounded-full bg-[#ffe2bd]">
            <div
              className="h-full rounded-full bg-[#FFB347]"
              style={{ width: `${fra.progressPercentage}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold text-[#6f6258]">
            <p>${fra.currentAmount.toFixed(2)} raised</p>
            <p>${fra.targetAmount.toFixed(2)} goal</p>
          </div>
        </div>
        <Link
          href={`/${profilePath}/browse/${fra.fraId}`}
          className="mt-5 flex h-10 w-full items-center justify-center rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
        >
          View details
        </Link>
      </article>
    ));
  };

  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#111111]">
      <Header account={account} />

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h1 className="mt-2 text-4xl font-black text-[#FFB347]">Fundraising Activities</h1>
            </div>
            <p className="text-sm font-semibold text-[#6f6258]">
              {filteredFRA.length} of {fraList.length} FRA found
            </p>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Search title or description"
                className="h-11 w-full rounded-md border border-[#cfc7b5] bg-white px-3 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30"
              />
            </div>

            <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-md border border-[#f0d8bd] bg-[#fff2df] px-3 py-1">
              <label
                className={`flex min-w-0 flex-1 items-center gap-2 text-sm font-medium transition ${
                  selectedCategoryId === "all" ? "text-[#9f9082]" : "text-[#222a24]"
                }`}
              >
                Category
                <select
                  value={selectedCategoryId}
                  onChange={(event) => setSelectedCategoryId(event.target.value)}
                  className={`h-8 min-w-0 flex-1 rounded-md border border-[#cfc7b5] bg-white px-2 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30 ${
                    selectedCategoryId === "all" ? "text-[#9f9082]" : "text-[#222a24]"
                  }`}
                >
                  <option value="all">All</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </label>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex h-8 items-center rounded-md border border-[#f0d8bd] px-3 text-sm font-semibold text-[#9b5d12] transition hover:border-[#FFB347] hover:text-[#FFB347]"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {displayFRASearchResults(filteredFRA)}
        </div>
      </section>
    </main>
  );
}
