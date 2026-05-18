import { FRA } from "@/entity/FRA";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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

// ViewFRAShortlistedController
export class ViewFRAShortlistedController {
  // getFRAshortlistedCount(fraId)
  async getFRAshortlistedCount(fraId: string): Promise<number> {
    if (!fraId.trim()) {
      throw new Error("FRA id is required.");
    }

    const supabase = createSupabaseAdminClient();

    const { data, error: fraError } = await supabase
      .from("fra")
      .select(
        "fra_id, user_id, category_id, title, description, target_amount, current_amount, start_date, status, view_count, fav_count, end_date, created_at, updated_at",
      )
      .eq("fra_id", fraId)
      .single()
      .overrideTypes<FRARow, { merge: false }>();

    if (fraError) {
      throw new Error(fraError.message);
    }

    const { count, error: favouriteError } = await supabase
      .from("favourite")
      .select("user_id", { count: "exact", head: true })
      .eq("fra_id", fraId);

    if (favouriteError) {
      throw new Error(favouriteError.message);
    }

    return new FRA({
      fraId: data.fra_id,
      userId: data.user_id,
      categoryId: data.category_id,
      title: data.title,
      description: data.description,
      targetAmount: Number(data.target_amount),
      currentAmount: Number(data.current_amount),
      startDate: data.start_date,
      status: data.status,
      viewCount: Number(data.view_count),
      favCount: count ?? 0,
      endDate: data.end_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }).getFRAshortlistedCount(fraId);
  }
}
