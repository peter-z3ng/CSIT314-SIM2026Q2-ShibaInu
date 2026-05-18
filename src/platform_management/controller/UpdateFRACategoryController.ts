import { FRACategory } from "@/entity/FRACategory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FRACategoryRow = {
  category_id: string;
  category_name: string;
  user_id: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
};

type UpdateFRACategoryInput = {
  categoryName: string;
  description: string;
};

// UpdateFRACategoryController
export class UpdateFRACategoryController {
  private readonly input?: UpdateFRACategoryInput;

  constructor(input?: UpdateFRACategoryInput) {
    this.input = input;
  }

  async getCategoryById(categoryId: string) {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("fra_category")
      .select("category_id, category_name, user_id, description, created_at, updated_at")
      .eq("category_id", categoryId)
      .single<FRACategoryRow>();

    if (error) {
      throw new Error(error.message);
    }

    return new FRACategory({
      categoryId: data.category_id,
      categoryName: data.category_name,
      userId: data.user_id,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }).toDTO();
  }

  // updateCategory(categoryId)
  async updateCategory(categoryId: string): Promise<boolean> {
    if (!this.input) {
      throw new Error("Category update details are required.");
    }

    const supabase = createSupabaseAdminClient();
    const categoryName = this.input.categoryName.trim();
    const categoryDescription = this.input.description.trim();

    FRACategory.updateCategory(categoryId);

    if (!categoryName) {
      throw new Error("Category name is required.");
    }

    const { error } = await supabase
      .from("fra_category")
      .update({
        category_name: categoryName,
        description: categoryDescription,
        updated_at: new Date().toISOString(),
      })
      .eq("category_id", categoryId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
