import { Favourite } from "@/entity/Favourite";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FavouriteRow = {
  fav_id: string;
  user_id: string;
  fra_id: string;
};

export class SaveFavouriteController {
  async isFavourite(user_id: string, fra_id: string): Promise<boolean> {
    if (!user_id.trim() || !fra_id.trim()) {
      return false;
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("favourite")
      .select("fav_id")
      .eq("user_id", user_id)
      .eq("fra_id", fra_id)
      .limit(1)
      .overrideTypes<Pick<FavouriteRow, "fav_id">[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return Boolean(data[0]?.fav_id);
  }

  async saveFavourite(user_id: string, fra_id: string): Promise<string> {
    if (!user_id.trim()) {
      throw new Error("User id is required.");
    }

    if (!fra_id.trim()) {
      throw new Error("FRA id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("favourite")
      .upsert(
        {
          user_id,
          fra_id,
        },
        {
          onConflict: "user_id,fra_id",
          ignoreDuplicates: true,
        },
      )
      .select("fav_id, user_id, fra_id")
      .limit(1)
      .overrideTypes<FavouriteRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const favourite = data[0] ? mapFavouriteRow(data[0]) : await this.getExistingFavourite(user_id, fra_id);

    if (!favourite.saveFavourite(user_id, fra_id)) {
      throw new Error("Unable to save favourite.");
    }

    return favourite.fav_id;
  }

  async removeFavourite(user_id: string, fra_id: string): Promise<boolean> {
    if (!user_id.trim()) {
      throw new Error("User id is required.");
    }

    if (!fra_id.trim()) {
      throw new Error("FRA id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("favourite")
      .delete()
      .eq("user_id", user_id)
      .eq("fra_id", fra_id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  private async getExistingFavourite(user_id: string, fra_id: string) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("favourite")
      .select("fav_id, user_id, fra_id")
      .eq("user_id", user_id)
      .eq("fra_id", fra_id)
      .limit(1)
      .overrideTypes<FavouriteRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    if (!data[0]) {
      throw new Error("Unable to save favourite.");
    }

    return mapFavouriteRow(data[0]);
  }
}

function mapFavouriteRow(row: FavouriteRow) {
  return new Favourite({
    fav_id: row.fav_id,
    user_id: row.user_id,
    fra_id: row.fra_id,
  });
}
