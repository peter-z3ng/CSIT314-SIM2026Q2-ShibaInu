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

    const { error } = await supabase
      .from("fra")
      .update({
        category_id: input.categoryId,
        title: input.title,
        description: input.description,
        end_date: input.endDate,
        status: input.status,
        updated_at: new Date().toISOString(),
      })
      .eq("fra_id", input.fraId)
      .eq("user_id", input.userId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}