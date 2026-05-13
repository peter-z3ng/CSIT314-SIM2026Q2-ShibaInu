import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type UpdateFRAInput = {
  fraId: string;
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  endDate: string;
  status: string;
};

export class UpdateFRAController {
  async updateFRA(input: UpdateFRAInput): Promise<boolean> {
    const supabase = createSupabaseAdminClient();

    const endDateISO = new Date(input.endDate).toISOString();

    const { data, error } = await supabase
      .from("fra")
      .update({
        category_id: input.categoryId,
        title: input.title,
        description: input.description,
        end_date: endDateISO,
        status: input.status,
        updated_at: new Date().toISOString(),
      })
      .eq("fra_id", input.fraId)
      .eq("user_id", input.userId)
      .select("fra_id, status, end_date");

    console.log("Updated FRA:", data);

    if (error) {
      console.error("Update FRA error:", error.message);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error("FRA update failed. No matching FRA found.");
    }

    return true;
  }
}