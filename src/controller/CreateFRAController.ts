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

    const startDateISO = new Date(input.startDate).toISOString();
    const endDateISO = new Date(input.endDate).toISOString();

    if (new Date(endDateISO) <= new Date(startDateISO)) {
      throw new Error("End date must be later than start date.");
    }

    const status = new Date(endDateISO) <= new Date() ? "closed" : "active";

    const { error } = await supabase.from("fra").insert({
      user_id: input.userId,
      category_id: input.categoryId,
      title: input.title,
      description: input.description,
      target_amount: input.targetAmount,
      current_amount: 0,
      start_date: startDateISO,
      end_date: endDateISO,
      status,
      view_count: 0,
      fav_count: 0,
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
