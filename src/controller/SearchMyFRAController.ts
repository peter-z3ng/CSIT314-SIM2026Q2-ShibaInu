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

export type SearchMyFRAInput = {
  userId: string;
  keyword?: string;
  categoryId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
};

export class SearchMyFRAController {
  async searchMyFRAs(input: SearchMyFRAInput): Promise<FRA[]> {
    const autoCloseController = new AutoCloseFRAController();
    await autoCloseController.autoCloseExpiredFRAs();

    const supabase = createSupabaseAdminClient();

    let query = supabase
      .from("fra")
      .select(
        "fra_id, user_id, category_id, title, description, target_amount, current_amount, start_date, status, view_count, fav_count, end_date, created_at, updated_at",
      )
      .eq("user_id", input.userId)
      .neq("status", "completed")
      .order("updated_at", { ascending: false, nullsFirst: false });

    if (input.keyword) {
      query = query.ilike("title", `%${input.keyword}%`);
    }

    const categoryIds = splitFilterValues(input.categoryId);

    if (categoryIds.length) {
      query = query.in("category_id", categoryIds);
    }

    const statuses = splitFilterValues(input.status).filter((status) =>
      ["active", "closed"].includes(status),
    );

    if (statuses.length) {
      query = query.in("status", statuses);
    }

    if (input.startDate) {
      query = query.gte("start_date", input.startDate);
    }

    if (input.endDate) {
      query = query.lte("end_date", input.endDate);
    }

    const { data, error } = await query.overrideTypes<
      FRARow[],
      { merge: false }
    >();

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

function splitFilterValues(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
