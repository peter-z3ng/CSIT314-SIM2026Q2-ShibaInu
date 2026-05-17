"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { DeleteCategoryPage } from "@/boundary/DeleteCategoryPage";
import { SearchFRACategoryPage } from "@/platform_management/boundary/SearchFRACategoryPage";
import type { RetrievedFRACategoryDTO } from "@/platform_management/controller/RetrieveFRACategoryController";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";

// RetrieveFRACategoryPage
export function RetrieveFRACategoryPage({
  account,
  categories,
  deleteCategoryAction,
}: {
  account: UserAccountDTO;
  categories: RetrievedFRACategoryDTO[];
  deleteCategoryAction: (formData: FormData) => Promise<{ success: boolean }>;
}) {
  const profilePath = profileToPath(account.profile);
  const searchParams = useSearchParams();

  const [successMessage, setSuccessMessage] = useState("");
  const [cannotDeleteMessage, setCannotDeleteMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RetrievedFRACategoryDTO | null>(null);

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

  function handleDeleteClick(category: RetrievedFRACategoryDTO) {
    setSelectedCategory(category);
  }

  // displayCategories()
  const displayCategories = () => (
    <SearchFRACategoryPage
      categories={categories}
      profilePath={profilePath}
      onDeleteCategory={handleDeleteClick}
    />
  );

  // displayError()
  const displayError = () =>
    cannotDeleteMessage ? (
      <div className="mt-6 w-full rounded-2xl border border-red-300 bg-red-50 px-5 py-6 text-sm font-bold text-red-700">
        {cannotDeleteMessage}
      </div>
    ) : null;

  return (
    <main className="min-h-screen bg-[#fffaf5] text-[#0b1f2a]">
      <Header account={account} />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="flex items-start justify-between">
          <h1 className="mt-3 text-4xl font-bold">Category Management</h1>

          <Link
            href={`/${profilePath}/create-categories`}
            className="rounded-full bg-[#FFB347] px-6 py-3 text-sm font-bold text-white shadow-sm"
          >
            Create Category
          </Link>
        </div>

        {successMessage && (
          <div className="mt-6 w-full rounded-2xl border border-green-300 bg-green-50 px-5 py-4 text-sm font-bold text-green-700">
            {successMessage}
          </div>
        )}

        {displayError()}
        {displayCategories()}
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
