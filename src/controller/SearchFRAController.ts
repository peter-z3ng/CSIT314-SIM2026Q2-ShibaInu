import { FRA } from "@/entity/FRA";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FRARow = {
  fra_id: string;
  title: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  status: string;
  category_id: string | null;
  category: {
    category_id: string;
    category_name: string;
  } | null;
};

type FRACategoryRow = {
  category_id: string;
  category_name: string;
};

export type SearchFRAInput = {
  keyword?: string;
  categoryId?: string;
};

export type FRACategoryDTO = {
  categoryId: string;
  category: string;
};

export class SearchFRAController {
  async searchFRA(input: SearchFRAInput = {}): Promise<FRA[]> {
    const keyword = input.keyword?.trim() ?? "";
    const categoryId = input.categoryId?.trim() ?? "";
    const supabase = createSupabaseAdminClient();

    let query = supabase
      .from("fra")
      .select(
        "fra_id, title, description, target_amount, current_amount, status, category_id, category:fra_category(category_id, category_name)",
      )
      .order("updated_at", { ascending: false, nullsFirst: false });

    if (keyword) {
      const pattern = `%${escapeSearchPattern(keyword)}%`;
      query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    }

    if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query.returns<FRARow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map(mapFRARow);
  }

  async listCategories(): Promise<FRACategoryDTO[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("fra_category")
      .select("category_id, category_name")
      .order("category_name", { ascending: true })
      .returns<FRACategoryRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map((category) => ({
      categoryId: category.category_id,
      category: category.category_name,
    }));
  }
}

function mapFRARow(row: FRARow) {
  return new FRA({
    fraId: row.fra_id,
    title: row.title,
    description: row.description,
    targetAmount: Number(row.target_amount),
    currentAmount: Number(row.current_amount),
    status: row.status,
    categoryId: row.category_id,
    category: row.category?.category_name ?? null,
  });
}

function escapeSearchPattern(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
