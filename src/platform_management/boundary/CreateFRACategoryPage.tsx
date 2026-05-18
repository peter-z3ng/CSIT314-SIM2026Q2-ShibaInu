import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { AuthController } from "@/controller/AuthController";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";
import { CreateFRACategoryController } from "@/platform_management/controller/CreateFRACategoryController";

export async function createCategory(formData: FormData): Promise<void> {
  "use server";

  const fallbackProfilePath = String(formData.get("profilePath") ?? "");
  let redirectPath = fallbackProfilePath ? `/${fallbackProfilePath}/create-categories` : "/login";

  try {
    const account = await new AuthController().getCurrentAccount();

    if (!account || account.status !== "active") {
      throw new Error("You must be logged in to create a category.");
    }

    if (account.profile.profile.toLowerCase() !== "platform management") {
      throw new Error("Only platform management can create FRA categories.");
    }

    const profilePath = profileToPath(account.profile);

    await new CreateFRACategoryController().createCategory(
      String(formData.get("categoryName") ?? ""),
      String(formData.get("description") ?? ""),
      account.userId,
    );

    revalidatePath(`/${profilePath}/categories`);
    revalidatePath(`/${profilePath}/create-categories`);
    redirectPath = `/${profilePath}/categories?success=created`;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "FRA category could not be created.";
    redirectPath = `${redirectPath}?error=${encodeURIComponent(message)}`;
  }

  redirect(redirectPath);
}

// CreateFRACategoryPage
export function CreateFRACategoryPage({
  account,
  successMessage = "",
  errorMessage = "",
}: {
  account: UserAccountDTO;
  successMessage?: string;
  errorMessage?: string;
}) {
  const profilePath = profileToPath(account.profile);

  // displaySuccess()
  const displaySuccess = () =>
    successMessage ? (
      <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
        {successMessage}
      </p>
    ) : null;

  // displayError()
  const displayError = () =>
    errorMessage ? (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
        {errorMessage}
      </p>
    ) : null;

  return (
    <main className="min-h-screen bg-[#fffaf5] text-[#0b1f2a]">
      <Header account={account} />

      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-10 py-8">
        <div className="w-full max-w-2xl">
          <form
            action={createCategory}
            className="w-full rounded-4xl border border-[#FFB347] bg-white/40 p-8 shadow-lg"
          >
            <h1 className="text-center text-3xl text-[#FFB347] font-bold py-6">Create FRA Category</h1>
            <input type="hidden" name="profilePath" value={profilePath} />

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

              {displaySuccess()}
              {displayError()}

              <div className="flex justify-end gap-2 pt-2">
                <Link
                  href={`/${profilePath}/categories`}
                  className="rounded-full border border-[#f0d8bd] px-4 py-2 text-xs font-bold text-[#5f5148] hover:bg-[#ffecec]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="rounded-full bg-[#FFB347] px-4 py-2 text-xs font-bold text-white hover:bg-[#FFBE5C]"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
