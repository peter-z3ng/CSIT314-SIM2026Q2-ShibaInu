import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CategoryDTO = {
  categoryId: string;
  categoryName: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export class ViewCategoryController {
  async viewCategories(): Promise<CategoryDTO[]> {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("fra_category")
      .select("category_id, category_name, description, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map((category) => ({
      categoryId: category.category_id,
      categoryName: category.category_name,
      description: category.description,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    }));
  }
}