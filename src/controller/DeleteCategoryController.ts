import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export class DeleteCategoryController {
  async deleteCategory(categoryId: string) {
    const supabase = createSupabaseAdminClient();

    const { count, error: checkError } = await supabase
      .from("fra")
      .select("fra_id", { count: "exact", head: true })
      .eq("category_id", categoryId);

    if (checkError) {
      throw new Error(checkError.message);
    }

    if ((count ?? 0) > 0) {
      throw new Error("This category is being used by FRAs.");
    }

    const { error } = await supabase
      .from("fra_category")
      .delete()
      .eq("category_id", categoryId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}