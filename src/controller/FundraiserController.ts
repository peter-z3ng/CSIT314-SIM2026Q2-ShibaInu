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

export class FundraiserController {
  async listMyFRAs(userId: string): Promise<FRA[]> {
    const autoCloseController = new AutoCloseFRAController();
    await autoCloseController.autoCloseExpiredFRAs();

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("fra")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .overrideTypes<FRARow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map(
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
  }
}