import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export class UpdateCategoryController {
    async getCategoryById(categoryId: string) {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
        .from("fra_category")
        .select("category_id, category_name, description")
        .eq("category_id", categoryId)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return {
        categoryId: data.category_id,
        categoryName: data.category_name,
        description: data.description ?? "",
    };
    }

  async updateCategory(input: {
    categoryId: string;
    categoryName: string;
    description: string;
  }) {
    const supabase = createSupabaseAdminClient();

    const categoryName = input.categoryName.trim();
    const description = input.description.trim();

    if (!categoryName) {
      throw new Error("Category name is required.");
    }

    const { error } = await supabase
      .from("fra_category")
      .update({
        category_name: categoryName,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("category_id", input.categoryId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}