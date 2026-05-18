"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { createFRACategory, type CreateFRACategoryState } from "@/controller/authActions";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";

// CreateFRACategoryPage
export function CreateFRACategoryPage({ account }: { account: UserAccountDTO }) {
  const router = useRouter();
  const profilePath = profileToPath(account.profile);
  const initialState: CreateFRACategoryState = {
    ok: true,
    message: "",
  };
  const [state, formAction, isPending] = useActionState(createFRACategory, initialState);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.ok) {
      router.push(`/${profilePath}/categories?success=created`);
    } else {
      router.push(`/${profilePath}/categories?error=${encodeURIComponent(state.message)}`);
    }

    router.refresh();
  }, [profilePath, router, state.message, state.ok]);

  return (
    <main className="min-h-screen bg-[#fffaf5] text-[#0b1f2a]">
      <Header account={account} />

      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-10 py-8">
        <div className="w-full max-w-2xl">
          <form
            action={formAction}
            className="w-full rounded-4xl border border-[#FFB347] bg-white/40 p-8 shadow-lg"
          >
            <h1 className="text-center text-3xl text-[#FFB347] font-bold py-6">Create FRA Category</h1>
            <div className="grid gap-6">
              <div>
                <label className="text-md font-bold text-[#9b5d12]">Category Name</label>

                <input
                  name="categoryName"
                  placeholder="Example: Education"
                  className="mt-2 w-full rounded-lg border border-[#f0d8bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#FFB347]"
                />
              </div>

              <div>
                <label className="text-md font-bold text-[#9b5d12]">Description</label>

                <textarea
                  name="description"
                  placeholder="Enter category description"
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-[#f0d8bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#FFB347]"
                />
              </div>

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
                  disabled={isPending}
                  className="rounded-full bg-[#FFB347] px-4 py-2 text-xs font-bold text-white hover:bg-[#FFBE5C] disabled:opacity-60"
                >
                  {isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
