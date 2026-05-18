import { FRA } from "@/entity/FRA";
import { FRACategory } from "@/entity/FRACategory";
import type { FRACategoryDTO } from "@/entity/FRACategory";
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

type FRACategoryRow = {
  category_id: string;
  category_name: string;
  user_id: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
};

// SearchFRAController
export class SearchFRAController {
  // searchFRA(...)
  async searchFRA(keyword: string = "", category: string = ""): Promise<FRA[]> {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("fra")
      .select(
        "fra_id, user_id, category_id, title, description, target_amount, current_amount, start_date, status, view_count, fav_count, end_date, created_at, updated_at",
      )
      .eq("status", "active")
      .order("updated_at", { ascending: false, nullsFirst: false })
      .overrideTypes<FRARow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return FRA.searchFRA(data.map(mapFRARow), keyword, category);
  }

  async listCategories(): Promise<FRACategoryDTO[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("fra_category")
      .select("category_id, category_name, user_id, description, created_at, updated_at")
      .order("category_name", { ascending: true })
      .overrideTypes<FRACategoryRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map((category) =>
      new FRACategory({
        categoryId: category.category_id,
        categoryName: category.category_name,
        userId: category.user_id,
        description: category.description,
        createdAt: category.created_at,
        updatedAt: category.updated_at,
      }).toDTO(),
    );
  }
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
