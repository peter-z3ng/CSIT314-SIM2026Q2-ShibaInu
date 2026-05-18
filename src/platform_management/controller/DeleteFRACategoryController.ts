import { FRACategory } from "@/entity/FRACategory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// DeleteFRACategoryController
export class DeleteFRACategoryController {
  // deleteFRACategory(categoryId)
  async deleteFRACategory(categoryId: string): Promise<boolean> {
    FRACategory.deleteFRACategory(categoryId);

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

    const { error } = await supabase.from("fra_category").delete().eq("category_id", categoryId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
