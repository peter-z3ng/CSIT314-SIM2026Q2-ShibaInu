import { FRACategory } from "@/entity/FRACategory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// CreateFRACategoryController
export class CreateFRACategoryController {
  // createCategory(...)
  async createCategory(category_name: string, description: string, user_id: string): Promise<boolean> {
    const supabase = createSupabaseAdminClient();

    const categoryName = category_name.trim();
    const categoryDescription = description.trim();

    FRACategory.createCategory(categoryName, categoryDescription, user_id);

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
      user_id,
      category_name: categoryName,
      description: categoryDescription,
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
