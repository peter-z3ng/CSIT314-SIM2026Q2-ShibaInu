import { revalidatePath } from "next/cache";
import { AuthController } from "@/controller/AuthController";
import { SaveFavouriteController } from "@/donee/controller/SaveFavouriteController";

// processFavourite(user_id, fra_id)
export async function processFavourite(formData: FormData): Promise<void> {
  "use server";

  const profilePath = String(formData.get("profilePath") ?? "");
  const user_id = String(formData.get("user_id") ?? "");
  const fra_id = String(formData.get("fra_id") ?? "");
  const favouriteAction = String(formData.get("favouriteAction") ?? "save");
  const account = await new AuthController().requireProfilePath(profilePath);

  if (account.userId !== user_id) {
    throw new Error("Unable to save favourite.");
  }

  const controller = new SaveFavouriteController();

  if (favouriteAction === "remove") {
    await controller.removeFavourite(user_id, fra_id);
  } else {
    await controller.saveFavourite(user_id, fra_id);
  }

  revalidatePath(`/${profilePath}/browse/${fra_id}`);
  revalidatePath(`/${profilePath}/favorites`);
}

// SaveFavouritePage
export function SaveFavouritePage({
  profilePath,
  user_id,
  fra_id,
  isSavedInitially,
}: {
  profilePath: string;
  user_id: string;
  fra_id: string;
  isSavedInitially: boolean;
}) {
  const isHeartFilled = isSavedInitially;
  const nextAction = isHeartFilled ? "remove" : "save";

  // displaySavedState(fra_id)
  const displaySavedState = (fra_id: string) => (
    <form
      action={processFavourite}
      className="relative flex w-10 flex-col items-center"
    >
      <input type="hidden" name="profilePath" value={profilePath} />
      <input type="hidden" name="user_id" value={user_id} />
      <input type="hidden" name="fra_id" value={fra_id} />
      <input type="hidden" name="favouriteAction" value={nextAction} />
      <button
        type="submit"
        aria-label={isHeartFilled ? "FRA saved as favourite" : "Save FRA as favourite"}
        className={`flex size-10 items-center justify-center rounded-full border transition ${
          isHeartFilled
            ? "border-[#FFB347] bg-[#fff2df] text-[#FFB347]"
            : "border-[#f0d8bd] bg-[#fffaf5] text-[#9b5d12] hover:border-[#FFB347] hover:bg-[#fff2df] hover:text-[#FFB347]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isHeartFilled ? "currentColor" : "none"}
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
