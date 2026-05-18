import { FRA } from "@/entity/FRA";
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

// RetrieveFRAController
export class RetrieveFRAController {
  // retrieveFRA(fra_id)
  async retrieveFRA(fra_id: string): Promise<FRA> {
    if (!fra_id.trim()) {
      throw new Error("FRA id is required.");
    }

    const autoCloseController = new AutoCloseFRAController();
    await autoCloseController.autoCloseExpiredFRAs();

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("fra")
      .select(
        "fra_id, user_id, category_id, title, description, target_amount, current_amount, start_date, status, view_count, fav_count, end_date, created_at, updated_at",
      )
      .eq("fra_id", fra_id)
      .single()
      .overrideTypes<FRARow, { merge: false }>();

    if (error) {
      throw new Error(error.message);
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
      favCount: Number(data.fav_count),
      endDate: data.end_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }).retrieveFRA(fra_id);
  }
}
