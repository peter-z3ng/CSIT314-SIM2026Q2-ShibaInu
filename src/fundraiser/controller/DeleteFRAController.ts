import { FRA } from "@/entity/FRA";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// DeleteFRAController
export class DeleteFRAController {
  // deleteFRA(fraId)
  async deleteFRA(fraId: string): Promise<boolean> {
    FRA.deleteFRA(fraId);

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("fra").delete().eq("fra_id", fraId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
