import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export class DeleteFRAController {
  async deleteFRA(
    fraId: string,
    userId: string,
  ): Promise<boolean> {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase
      .from("fra")
      .delete()
      .eq("fra_id", fraId)
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}