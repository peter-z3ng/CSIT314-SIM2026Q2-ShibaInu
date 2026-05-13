"use server";

import { revalidatePath } from "next/cache";
import { AuthController } from "@/controller/AuthController";
import { SaveFavouriteController } from "@/controller/SaveFavouriteController";

export type SaveFavouriteState = {
  ok: boolean;
  message: string;
  saved: boolean;
};

export async function processFavourite(
  previousState: SaveFavouriteState,
  formData: FormData,
): Promise<SaveFavouriteState> {
  try {
    const profilePath = String(formData.get("profilePath") ?? "");
    const fra_id = String(formData.get("fra_id") ?? "");
    const favouriteAction = String(formData.get("favouriteAction") ?? "save");
    const account = await new AuthController().requireProfilePath(profilePath);
    const controller = new SaveFavouriteController();

    if (favouriteAction === "remove") {
      await controller.removeFavourite(account.userId, fra_id);
    } else {
      await controller.saveFavourite(account.userId, fra_id);
    }

    revalidatePath(`/${profilePath}/browse/${fra_id}`);
    revalidatePath(`/${profilePath}/favorites`);

    return favouriteAction === "remove"
      ? { ok: true, message: "", saved: false }
      : { ok: true, message: "Saved", saved: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to save favourite.",
      saved: previousState.saved,
    };
  }
}
