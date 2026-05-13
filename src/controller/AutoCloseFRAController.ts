import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export class AutoCloseFRAController {
  async autoCloseExpiredFRAs(): Promise<boolean> {
    const supabase = createSupabaseAdminClient();

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("fra")
      .update({
        status: "closed",
        updated_at: now,
      })
      .eq("status", "active")
      .not("end_date", "is", null)
      .lt("end_date", now);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}