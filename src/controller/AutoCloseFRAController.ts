import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FRARow = {
  fra_id: string;
  start_date: string;
  end_date: string | null;
  status: string;
};

export class AutoCloseFRAController {
  async autoCloseExpiredFRAs(): Promise<boolean> {
    const supabase = createSupabaseAdminClient();

    const now = new Date();
    const nowIso = now.toISOString();

    const { data, error } = await supabase
      .from("fra")
      .select("fra_id, start_date, end_date, status")
      .neq("status", "completed")
      .overrideTypes<FRARow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    for (const fra of data) {
      const newStatus = getAutoStatus(fra.start_date, fra.end_date, fra.status);

      if (newStatus !== fra.status) {
        const { error: updateError } = await supabase
          .from("fra")
          .update({
            status: newStatus,
            updated_at: nowIso,
          })
          .eq("fra_id", fra.fra_id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }
    }

    return true;
  }
}

function getAutoStatus(startDate: string, endDate: string | null, currentStatus: string) {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (currentStatus === "completed") {
    return "completed";
  }

  if (now < start) {
    return "closed";
  }

  if (end && now > end) {
    return "closed";
  }

  return "active";
}
