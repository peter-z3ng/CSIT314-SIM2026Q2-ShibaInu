"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import type { FavouriteDTO } from "@/entity/Favourite";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";

export function SearchFavouriteListPage({
  account,
  favouriteList,
  categories,
}: {
  account: UserAccountDTO;
  favouriteList: FavouriteDTO[];
  categories: FRACategoryDTO[];
}) {
  const [keyword, setKeyword] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const profilePath = profileToPath(account.profile);

  const categoryNameById = useMemo(() => {
    return new Map(
      categories.map((category) => [category.categoryId, category.categoryName]),
    );
  }, [categories]);

  const statusOptions = useMemo(() => {
    return Array.from(
      new Set(
        favouriteList
          .map((favourite) => favourite.fra?.status)
          .filter((status): status is string => Boolean(status)),
      ),
    ).sort();
  }, [favouriteList]);

  const filteredFavourites = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const normalizedStatus = selectedStatus.toLowerCase();

    return favouriteList.filter((favourite) => {
      const fra = favourite.fra;

      if (!fra) {
        return false;
      }

      const categoryName = categoryNameById.get(fra.categoryId);
      const matchesKeyword =
        !normalizedKeyword ||
        fra.title.toLowerCase().includes(normalizedKeyword) ||
        (fra.description?.toLowerCase().includes(normalizedKeyword) ?? false) ||
        (categoryName?.toLowerCase().includes(normalizedKeyword) ?? false);
      const matchesCategory =
        selectedCategoryId === "all" || fra.categoryId === selectedCategoryId;
      const matchesStatus =
        normalizedStatus === "all" || fra.status.toLowerCase() === normalizedStatus;

      return matchesKeyword && matchesCategory && matchesStatus;
    });
  }, [categoryNameById, favouriteList, keyword, selectedCategoryId, selectedStatus]);

  const hasFilters =
    keyword.trim() !== "" || selectedCategoryId !== "all" || selectedStatus !== "all";

  const clearFilters = () => {
    setKeyword("");
    setSelectedCategoryId("all");
    setSelectedStatus("all");
  };

  const displayError = (message: string) => (
    <p className="rounded-2xl bg-white p-5 text-sm text-[#6f6258] md:col-span-2 xl:col-span-3">
      {message}
    </p>
  );

  const displayFavouriteSearchResults = (results: FavouriteDTO[]) => {
    if (!results.length) {
      return displayError("No matching favourite fundraising activities found.");
    }

    return results.map((favourite) => {
      const fra = favourite.fra;

      if (!fra) {
        return null;
      }

      return (
        <article key={favourite.fav_id} className="rounded-2xl bg-white p-5 shadow-sm">
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
      );
    });
  };

  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#111111]">
      <Header account={account} />

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h1 className="mt-2 text-4xl font-black text-[#FFB347]">
                Favourite Fundraising Activities
              </h1>
            </div>
            <p className="text-sm font-semibold text-[#6f6258]">
              {filteredFavourites.length} of {favouriteList.length} favourites found
            </p>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-4">
            <div className="xl:col-span-2">
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Search favourite title or description"
                className="h-11 w-full rounded-md border border-[#cfc7b5] bg-white px-3 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30"
              />
            </div>

            <FilterSelect
              label="Category"
              value={selectedCategoryId}
              onChange={setSelectedCategoryId}
              faded={selectedCategoryId === "all"}
              options={[
                { value: "all", label: "All" },
                ...categories.map((category) => ({
                  value: category.categoryId,
                  label: category.categoryName,
                })),
              ]}
            />

            <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-md border border-[#f0d8bd] bg-[#fff2df] px-3 py-1">
              <FilterSelect
                label="Status"
                value={selectedStatus}
                onChange={setSelectedStatus}
                faded={selectedStatus === "all"}
                options={[
                  { value: "all", label: "All" },
                  ...statusOptions.map((status) => ({
                    value: status,
                    label: status,
                  })),
                ]}
                unframed
              />
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
          {displayFavouriteSearchResults(filteredFavourites)}
        </div>
      </section>
    </main>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  faded,
  unframed = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  faded: boolean;
  unframed?: boolean;
}) {
  const content = (
    <label
      className={`flex min-w-0 flex-1 items-center gap-2 text-sm font-medium transition ${
        faded ? "text-[#9f9082]" : "text-[#222a24]"
      }`}
    >
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-8 min-w-0 flex-1 rounded-md border border-[#cfc7b5] bg-white px-2 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30 ${
          faded ? "text-[#9f9082]" : "text-[#222a24]"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );

  if (unframed) {
    return content;
  }

  return (
    <div className="flex min-h-11 items-center rounded-md border border-[#f0d8bd] bg-[#fff2df] px-3 py-1">
      {content}
    </div>
  );
}
