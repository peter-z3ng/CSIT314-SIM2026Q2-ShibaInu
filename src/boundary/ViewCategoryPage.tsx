"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { DeleteCategoryPage } from "@/boundary/DeleteCategoryPage";
import type { UserAccountDTO } from "@/entity/UserAccount";
import type { CategoryDTO } from "@/controller/ViewCategoryController";
import { profileToPath } from "@/entity/UserProfile";

export function ViewCategoryPage({
  account,
  categories,
  deleteCategoryAction,
}: {
  account: UserAccountDTO;
  categories: CategoryDTO[];
  deleteCategoryAction: (
    formData: FormData,
  ) => Promise<{ success: boolean }>;
}) {
  const profilePath = profileToPath(account.profile);
  const searchParams = useSearchParams();

  const [successMessage, setSuccessMessage] = useState("");
  const [cannotDeleteMessage, setCannotDeleteMessage] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryDTO | null>(null);

  useEffect(() => {
    const success = searchParams.get("success");

    if (success === "updated") {
      setSuccessMessage("Category updated successfully.");
    }

    if (success === "created") {
      setSuccessMessage("Category created successfully.");
    }

    if (success === "deleted") {
      setSuccessMessage("Category deleted successfully.");
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 7000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  function handleDeleteClick(category: CategoryDTO) {
    setSelectedCategory(category);
    }

  return (
    <main className="min-h-screen bg-[#fffaf5] text-[#0b1f2a]">
      <Header account={account} />

      <section className="px-10 py-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-[#a45f00]">
              PLATFORM MANAGEMENT
            </p>

            <h1 className="mt-3 text-4xl font-bold">Category Management</h1>

            <p className="mt-2 text-base text-[#6f6258]">
              View and manage FRA categories.
            </p>
          </div>

          <Link
            href={`/${profilePath}/create-categories`}
            className="rounded-2xl bg-[#FFB347] px-6 py-3 text-sm font-bold text-white shadow-sm"
          >
            Create Category
          </Link>
        </div>

        {successMessage && (
          <div className="mt-6 w-full rounded-2xl border border-green-300 bg-green-50 px-5 py-4 text-sm font-bold text-green-700">
            {successMessage}
          </div>
        )}

        {cannotDeleteMessage && (
          <div className="mt-6 w-full rounded-2xl border border-red-300 bg-red-50 px-5 py-6 text-sm font-bold text-red-700">
            {cannotDeleteMessage}
          </div>
        )}

        <section className="mt-8 rounded-3xl border border-[#f0d8bd] bg-[#fffaf5] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">FRA Categories</h2>

            <p className="text-sm font-bold text-[#a45f00]">
              {categories.length} Categories
            </p>
          </div>

          <div className="mt-6">
            <input
              placeholder="Search category name or description"
              className="w-full rounded-xl border border-[#f0d8bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#FFB347]"
            />
          </div>

          <div className="mt-8 grid grid-cols-[1.1fr_2fr_1fr_1fr_1.3fr] border-b border-[#ead8c4] pb-4 text-sm font-bold text-[#5f5148]">
            <p>Category Name</p>
            <p>Description</p>
            <p>Created At</p>
            <p>Updated At</p>
            <p>Action</p>
          </div>

          {categories.map((category) => (
            <div
              key={category.categoryId}
              className="grid grid-cols-[1.1fr_2fr_1fr_1fr_1.3fr] items-center border-b border-[#ead8c4] py-5"
            >
              <p className="text-sm font-bold">{category.categoryName}</p>

              <p className="pr-6 text-sm text-[#5f5148]">
                {category.description || "No description provided."}
              </p>

              <p className="text-xs text-[#6f6258]">
                {new Date(category.createdAt).toLocaleDateString()}
              </p>

              <p className="text-xs text-[#6f6258]">
                {category.updatedAt
                  ? new Date(category.updatedAt).toLocaleDateString()
                  : "-"}
              </p>

              <div className="flex gap-2">
                <Link
                  href={`/${profilePath}/categories/${category.categoryId}/edit`}
                  className="rounded-lg bg-[#FFB347] px-4 py-2 text-xs font-bold text-white"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => handleDeleteClick(category)}
                  className="rounded-lg bg-red-100 px-4 py-2 text-xs font-bold text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="py-6 text-sm font-semibold text-[#6f6258]">
              No categories found.
            </p>
          )}
        </section>
      </section>

      <DeleteCategoryPage
        categoryId={selectedCategory?.categoryId || ""}
        categoryName={selectedCategory?.categoryName || ""}
        isUsed={selectedCategory?.isUsed || false}
        isOpen={selectedCategory !== null}
        onClose={() => setSelectedCategory(null)}
        deleteCategoryAction={deleteCategoryAction}
        />
    </main>
  );
}