"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";

// UpdateFRACategoryPage
export function UpdateFRACategoryPage({
  account,
  category,
  updateCategoryAction,
}: {
  account: UserAccountDTO;
  category: FRACategoryDTO;
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
      setMessage(error instanceof Error ? error.message : "Failed to update category.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // displayMessage(message)
  const displayMessage = (message: string) => (
    <p className="rounded-lg bg-[#fff2df] px-3 py-2 text-xs font-semibold text-[#9b5d12]">
      {message}
    </p>
  );

  return (
    <main className="min-h-screen bg-[#fffaf5] text-[#0b1f2a]">
      <Header account={account} />

      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-10 py-8">
        <div className="w-full max-w-2xl">
          <form
            action={handleSubmit}
            className="w-full rounded-4xl border border-[#FFB347] bg-white/40 p-8 shadow-lg"
          >
            <h1 className="py-6 text-center text-3xl font-bold text-[#FFB347]">
              Update FRA Category
            </h1>

            <input type="hidden" name="categoryId" value={category.categoryId} />

            <div className="grid gap-6">
              <div>
                <label className="text-md font-bold text-[#9b5d12]">Category Name</label>

                <input
                  name="categoryName"
                  defaultValue={category.categoryName}
                  className="mt-2 w-full rounded-lg border border-[#f0d8bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#FFB347]"
                />
              </div>

              <div>
                <label className="text-md font-bold text-[#9b5d12]">Description</label>

                <textarea
                  name="description"
                  defaultValue={category.description ?? ""}
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-[#f0d8bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#FFB347]"
                />
              </div>

              {message ? displayMessage(message) : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => router.push(`/${profilePath}/categories`)}
                  className="rounded-full border border-[#f0d8bd] px-4 py-2 text-xs font-bold text-[#5f5148] hover:bg-[#ffecec]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-[#FFB347] px-4 py-2 text-xs font-bold text-white hover:bg-[#FFBE5C] disabled:opacity-60"
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
