import { FRACategory, type FRACategoryDTO } from "@/entity/FRACategory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FRACategoryRow = {
  category_id: string;
  category_name: string;
  user_id: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
};

export class FRACategoryController {
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
