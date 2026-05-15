import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { FRACategory } from "@/entity/FRACategory";
import type { FRACategoryDTO } from "@/entity/FRACategory";

type FRACategoryRow = {
  category_id: string;
  category_name: string;
  user_id: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
};

export class PlatformManagementController {
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

  async getTotalUsers(): Promise<number> {
    const supabase = createSupabaseAdminClient();

    const { count, error } = await supabase
      .from("user_account")
      .select("user_id", { count: "exact", head: true });

    if (error) {
      throw new Error(error.message);
    }

    return count ?? 0;
  }
}