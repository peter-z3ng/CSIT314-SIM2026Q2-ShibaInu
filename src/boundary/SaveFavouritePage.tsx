import { revalidatePath } from "next/cache";
import { AuthController } from "@/controller/AuthController";
import { SaveFavouriteController } from "@/controller/SaveFavouriteController";

export function SaveFavouritePage({
  profilePath,
  fra_id,
}: {
  profilePath: string;
  fra_id: string;
}) {
  const displaySavedState = (fra_id: string) => (
    <form action={processFavourite}>
      <input type="hidden" name="profilePath" value={profilePath} />
      <input type="hidden" name="fra_id" value={fra_id} />
      <button
        type="submit"
        aria-label="Save FRA as favourite"
        className="flex size-11 items-center justify-center rounded-full border border-[#f0d8bd] bg-[#fffaf5] text-[#9b5d12] transition hover:border-[#FFB347] hover:bg-[#fff2df] hover:text-[#FFB347]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.936 0-3.6 1.126-4.312 2.733C11.288 4.876 9.624 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>
    </form>
  );

  return displaySavedState(fra_id);
}

export async function processFavourite(formData: FormData) {
  "use server";

  const profilePath = String(formData.get("profilePath") ?? "");
  const fra_id = String(formData.get("fra_id") ?? "");
  const account = await new AuthController().requireProfilePath(profilePath);

  await new SaveFavouriteController().saveFavourite(account.userId, fra_id);

  revalidatePath(`/${profilePath}/browse/${fra_id}`);
  revalidatePath(`/${profilePath}/favorites`);
}
