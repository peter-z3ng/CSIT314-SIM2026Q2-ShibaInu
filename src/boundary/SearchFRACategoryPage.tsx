"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchFRACategoryController } from "@/controller/SearchFRACategoryController";
import type { RetrievedFRACategoryDTO } from "@/platform_management/controller/RetrieveFRACategoryController";

// SearchFRACategoryPage
export function SearchFRACategoryPage({
  categories,
  profilePath,
  onDeleteCategory,
}: {
  categories: RetrievedFRACategoryDTO[];
  profilePath: string;
  onDeleteCategory: (category: RetrievedFRACategoryDTO) => void;
}) {
  const [keyword, setKeyword] = useState("");

  const searchResults = useMemo(() => {
    const controller = new SearchFRACategoryController(categories);
    const matchedCategoryIds = new Set(
      controller.searchCategory(keyword).map((category) => category.categoryId),
    );

    return categories.filter((category) => matchedCategoryIds.has(category.categoryId));
  }, [categories, keyword]);

  // displaySearchResults(array[FRACategory])
  const displaySearchResults = (searchResults: RetrievedFRACategoryDTO[]) => (
    <div className="overflow-x-auto rounded-2xl border border-[#FFB347] bg-white/40 p-5 shadow-lg">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#f0d8bd] text-md text-[#6f6258]">
            <th className="py-3 pr-4 font-semibold">Category Name</th>
            <th className="py-3 pr-4 font-semibold">Description</th>
            <th className="py-3 pr-4 font-semibold">Created At</th>
            <th className="py-3 pr-4 font-semibold">Updated At</th>
            <th className="py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((category) => (
            <tr key={category.categoryId} className="border-b border-[#f6e7d6]">
              <td className="py-4 pr-4 font-semibold">{category.categoryName}</td>
              <td className="py-4 pr-4 text-[#5f5148]">
                {category.description || "No description provided."}
              </td>
              <td className="py-4 pr-4 text-xs text-[#6f6258]">
                {new Date(category.createdAt).toLocaleDateString()}
              </td>
              <td className="py-4 pr-4 text-xs text-[#6f6258]">
                {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : "-"}
              </td>
              <td className="py-4">
                <div className="flex gap-2">
                  <Link
                    href={`/${profilePath}/categories/${category.categoryId}/edit`}
                    className="inline-flex h-9 items-center rounded-3xl bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => onDeleteCategory(category)}
                    className="inline-flex h-9 items-center rounded-3xl bg-red-100 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // displayMessage(message)
  const displayMessage = (message: string) => (
    <div className="rounded-2xl border border-[#FFB347] bg-white/40 p-8 text-center text-sm font-semibold text-[#6f6258] shadow-lg">
      {message}
    </div>
  );

  return (
    <section className="mt-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">FRA Categories</h2>
        <p className="text-sm font-semibold text-[#9b5d12]">
          {searchResults.length} of {categories.length} Categories
        </p>
      </div>

      <div className="mt-5 grid gap-6">
        <div className="rounded-4xl border border-[#f0d8bd]/60 bg-white/40 px-4 py-3 shadow-xs">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search category"
            className="h-10 w-full bg-transparent px-2 text-lg outline-none placeholder:text-[#9f9082]"
          />
        </div>

        {searchResults.length
          ? displaySearchResults(searchResults)
          : displayMessage("No categories match your search.")}
      </div>
    </section>
  );
}
