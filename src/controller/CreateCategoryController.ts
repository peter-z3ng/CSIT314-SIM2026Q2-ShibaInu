import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export class CreateCategoryController {
  async createCategory(input: { userId: string; categoryName: string; description: string }) {
    const supabase = createSupabaseAdminClient();

    const categoryName = input.categoryName.trim();
    const description = input.description.trim();

    if (!categoryName) {
      throw new Error("Category name is required.");
    }

    const { data: existingCategory, error: checkError } = await supabase
      .from("fra_category")
      .select("category_id")
      .ilike("category_name", categoryName)
      .maybeSingle();

    if (checkError) {
      throw new Error(checkError.message);
    }

    if (existingCategory) {
      throw new Error("This category already exists.");
    }

    const { error } = await supabase.from("fra_category").insert({
      user_id: input.userId,
      category_name: categoryName,
      description,
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
