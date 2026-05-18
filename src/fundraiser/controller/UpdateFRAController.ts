import { FRA } from "@/entity/FRA";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// UpdateFRAController
export class UpdateFRAController {
  // updateFRA(...)
  async updateFRA(
    fra_id: string,
    user_id: string,
    title: string,
    description: string,
    category: string,
    endDate: string,
    status: string,
  ): Promise<boolean> {
    FRA.updateFRA(fra_id, title, description, category, endDate, status);

    if (!user_id.trim()) {
      throw new Error("User id is required.");
    }

    const supabase = createSupabaseAdminClient();

    const endDateValue = toDateOnlyValue(endDate);

    const { data, error } = await supabase
      .from("fra")
      .update({
        category_id: category,
        title,
        description,
        end_date: endDateValue,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("fra_id", fra_id)
      .eq("user_id", user_id)
      .select("fra_id, status, end_date");

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error("FRA update failed. No matching FRA found.");
    }

    return true;
  }
}

function toDateOnlyValue(value: string) {
  const [date] = value.split("T");

  if (!date) {
    throw new Error("Date is required.");
  }

  return date;
}
