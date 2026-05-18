"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { DeleteFRACategoryPage } from "@/platform_management/boundary/DeleteFRACategoryPage";
import { SearchFRACategoryPage } from "@/platform_management/boundary/SearchFRACategoryPage";
import type { RetrievedFRACategoryDTO } from "@/platform_management/controller/RetrieveFRACategoryController";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";

// RetrieveFRACategoryPage
export function RetrieveFRACategoryPage({
  account,
  categories,
  deleteFRACategoryAction,
}: {
  account: UserAccountDTO;
  categories: RetrievedFRACategoryDTO[];
  deleteFRACategoryAction: (formData: FormData) => Promise<{ success: boolean; message: string }>;
}) {
  const profilePath = profileToPath(account.profile);
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<RetrievedFRACategoryDTO | null>(null);
  const success = searchParams.get("success");
  const errorMessage = searchParams.get("error") ?? "";
  const successMessage =
    success === "updated"
      ? "Category updated successfully."
      : success === "created"
        ? "Category created successfully."
        : success === "deleted"
          ? "Category deleted successfully."
          : "";

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

  // displayMessage(message)
  const displayMessage = (message: string, type: "success" | "error") =>
    message ? (
      <div
        className={`mt-6 w-full rounded-2xl border px-5 py-4 text-sm font-bold ${
          type === "success"
            ? "border-green-300 bg-green-50 text-green-700"
            : "border-red-300 bg-red-50 text-red-700"
        }`}
      >
        {message}
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

        {displayMessage(successMessage, "success")}
        {displayMessage(errorMessage, "error")}
        {displayCategories()}
      </section>

      <DeleteFRACategoryPage
        categoryId={selectedCategory?.categoryId || ""}
        categoryName={selectedCategory?.categoryName || ""}
        isUsed={selectedCategory?.isUsed || false}
        isOpen={selectedCategory !== null}
        onClose={() => setSelectedCategory(null)}
        deleteFRACategoryAction={deleteFRACategoryAction}
      />
    </main>
  );
}
