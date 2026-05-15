import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CategoryDTO = {
  categoryId: string;
  categoryName: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
  isUsed: boolean;
};

export class ViewCategoryController {
  async viewCategories(): Promise<CategoryDTO[]> {
    const supabase = createSupabaseAdminClient();

    const { data: categories, error: categoryError } = await supabase
      .from("fra_category")
      .select("category_id, category_name, description, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (categoryError) {
      throw new Error(categoryError.message);
    }

    const { data: fras, error: fraError } = await supabase
      .from("fra")
      .select("category_id");

    if (fraError) {
      throw new Error(fraError.message);
    }

    const usedCategoryIds = new Set(
      fras.map((fra) => fra.category_id),
    );

    return categories.map((category) => ({
      categoryId: category.category_id,
      categoryName: category.category_name,
      description: category.description,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
      isUsed: usedCategoryIds.has(category.category_id),
    }));
  }
}