import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export class AutoCloseFRAController {
  async autoCloseExpiredFRAs() {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase
      .from("fra")
      .update({ status: "closed" })
      .eq("status", "active")
      .lt("end_date", new Date().toISOString());

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}