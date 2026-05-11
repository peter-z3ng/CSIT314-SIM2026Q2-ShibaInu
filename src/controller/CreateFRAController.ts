import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CreateFRAInput = {
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  targetAmount: number;
  startDate: string;
  endDate: string;
};

export class CreateFRAController {
  async createFRA(input: CreateFRAInput): Promise<boolean> {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.from("fra").insert({
      user_id: input.userId,
      category_id: input.categoryId,
      title: input.title,
      description: input.description,
      target_amount: input.targetAmount,
      current_amount: 0,
      start_date: input.startDate,
      end_date: input.endDate,
      status: "active",
      view_count: 0,
      fav_count: 0,
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}