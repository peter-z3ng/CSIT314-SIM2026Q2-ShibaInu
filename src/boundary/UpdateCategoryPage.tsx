"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";

export function UpdateCategoryPage({
  account,
  category,
  updateCategoryAction,
}: {
  account: UserAccountDTO;
  category: {
    categoryId: string;
    categoryName: string;
    description: string;
  };
  updateCategoryAction: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const profilePath = profileToPath(account.profile);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setMessage("");
    setIsSubmitting(true);

    try {
      await updateCategoryAction(formData);

      router.push(`/${profilePath}/categories?success=updated`);
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to update category.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fffaf5] text-[#0b1f2a]">
      <Header account={account} />

      <section className="px-10 pt-6">
        <button
          type="button"
          onClick={() => router.push(`/${profilePath}/categories`)}
          className="flex items-center gap-2 text-sm font-semibold text-[#a45f00] transition hover:opacity-70"
        >
          ← Back to Categories
        </button>
      </section>

      <section className="px-10 py-4">
        <h1 className="mt-2 text-3xl font-bold">Update Category</h1>

        <p className="mt-1 text-sm text-[#6f6258]">
          Edit FRA category information.
        </p>

        <div className="mt-6 flex justify-center">
          <form
            action={handleSubmit}
            className="w-full max-w-2xl rounded-2xl border border-[#f0d8bd] bg-white p-5 shadow-sm"
          >
            <input type="hidden" name="categoryId" value={category.categoryId} />

            <div className="grid gap-4">
              <div>
                <label className="text-xs font-bold text-[#5f5148]">
                  Category Name
                </label>

                <input
                  name="categoryName"
                  defaultValue={category.categoryName}
                  className="mt-2 w-full rounded-lg border border-[#f0d8bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#FFB347]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5f5148]">
                  Description
                </label>

                <textarea
                  name="description"
                  defaultValue={category.description}
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-[#f0d8bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#FFB347]"
                />
              </div>

              {message && (
                <p className="rounded-lg bg-[#fff2df] px-3 py-2 text-xs font-semibold text-[#9b5d12]">
                  {message}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => router.push(`/${profilePath}/categories`)}
                  className="rounded-lg border border-[#f0d8bd] px-4 py-2 text-xs font-bold text-[#5f5148]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-[#FFB347] px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}