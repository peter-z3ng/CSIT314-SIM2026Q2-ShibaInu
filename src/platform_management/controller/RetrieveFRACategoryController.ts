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

type FRARow = {
  category_id: string | null;
};

export type RetrievedFRACategoryDTO = FRACategoryDTO & {
  isUsed: boolean;
};

// RetrieveFRACategoryController
export class RetrieveFRACategoryController {
  // retrieveCategories()
  async retrieveCategories(): Promise<RetrievedFRACategoryDTO[]> {
    const supabase = createSupabaseAdminClient();

    const { data: categories, error: categoryError } = await supabase
      .from("fra_category")
      .select("category_id, category_name, user_id, description, created_at, updated_at")
      .order("created_at", { ascending: false })
      .overrideTypes<FRACategoryRow[], { merge: false }>();

    if (categoryError) {
      throw new Error(categoryError.message);
    }

    const { data: fras, error: fraError } = await supabase
      .from("fra")
      .select("category_id")
      .overrideTypes<FRARow[], { merge: false }>();

    if (fraError) {
      throw new Error(fraError.message);
    }

    const usedCategoryIds = new Set(fras.map((fra) => fra.category_id));
    const categoryEntities = categories.map(
      (category) =>
        new FRACategory({
          categoryId: category.category_id,
          categoryName: category.category_name,
          userId: category.user_id,
          description: category.description,
          createdAt: category.created_at,
          updatedAt: category.updated_at,
        }),
    );

    return FRACategory.retrieveCategories(categoryEntities).map((category) => ({
      ...category.toDTO(),
      isUsed: usedCategoryIds.has(category.categoryId),
    }));
  }
}
