import { FRA } from "@/entity/FRA";
import { SaveFavouriteController } from "@/donee/controller/SaveFavouriteController";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AutoCloseFRAController } from "@/controller/AutoCloseFRAController";

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

// ViewCompletedFRAController
export class ViewCompletedFRAController {
  // getCompletedFRA(userId)
  async getCompletedFRA(userId: string): Promise<FRA[]> {
    if (!userId.trim()) {
      throw new Error("User id is required.");
    }

    const autoCloseController = new AutoCloseFRAController();
    await autoCloseController.autoCloseExpiredFRAs();
    await new SaveFavouriteController().syncAllFavouriteCounts();

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("fra")
      .select(
        "fra_id, user_id, category_id, title, description, target_amount, current_amount, start_date, status, view_count, fav_count, end_date, created_at, updated_at",
      )
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("updated_at", { ascending: false, nullsFirst: false })
      .overrideTypes<FRARow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const completedFRAs = data.map(
      (fra) =>
        new FRA({
          fraId: fra.fra_id,
          userId: fra.user_id,
          categoryId: fra.category_id,
          title: fra.title,
          description: fra.description,
          targetAmount: Number(fra.target_amount),
          currentAmount: Number(fra.current_amount),
          startDate: fra.start_date,
          status: fra.status,
          viewCount: Number(fra.view_count),
          favCount: Number(fra.fav_count),
          endDate: fra.end_date,
          createdAt: fra.created_at,
          updatedAt: fra.updated_at,
        }),
    );

    return FRA.getCompletedFRA(completedFRAs, userId);
  }
}
