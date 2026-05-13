import { Favourite } from "@/entity/Favourite";
import { FRA } from "@/entity/FRA";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FavouriteRow = {
  fav_id: string;
  user_id: string;
  fra_id: string;
  fra: FRARow | null;
};

type FRARow = {
  fra_id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  start_date: string;
  status: string;
  view_count: number;
  fav_count: number;
  end_date: string | null;
  created_at: string;
  updated_at: string | null;
};

export class SearchFavouriteController {
  async searchFavourite(
    user_id: string,
    keyword: string = "",
    category: string = "all",
    status: string = "all",
  ): Promise<Favourite[]> {
    if (!user_id.trim()) {
      throw new Error("User id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("favourite")
      .select(
        "fav_id, user_id, fra_id, fra:fra_id(fra_id, user_id, category_id, title, description, target_amount, current_amount, start_date, status, view_count, fav_count, end_date, created_at, updated_at)",
      )
      .eq("user_id", user_id)
      .overrideTypes<FavouriteRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return data
      .map(mapFavouriteRow)
      .flatMap((favourite) =>
        favourite.searchFavourite(user_id, keyword, category, status),
      );
  }
}

function mapFavouriteRow(row: FavouriteRow) {
  return new Favourite({
    fav_id: row.fav_id,
    user_id: row.user_id,
    fra_id: row.fra_id,
    fra: row.fra ? mapFRARow(row.fra) : null,
  });
}

function mapFRARow(row: FRARow) {
  return new FRA({
    fraId: row.fra_id,
    userId: row.user_id,
    categoryId: row.category_id,
    title: row.title,
    description: row.description,
    targetAmount: Number(row.target_amount),
    currentAmount: Number(row.current_amount),
    status: row.status,
    startDate: row.start_date,
    viewCount: Number(row.view_count),
    favCount: Number(row.fav_count),
    endDate: row.end_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}
