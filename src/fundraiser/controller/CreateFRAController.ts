import { FRA } from "@/entity/FRA";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// CreateFRAController
export class CreateFRAController {
  // createFRA(...)
  async createFRA(
    fundraiser_id: string,
    title: string,
    description: string,
    targetAmount: number,
    category: string,
    startDate: string,
    endDate: string,
  ): Promise<boolean> {
    FRA.createFRA(fundraiser_id, title, description, targetAmount, category, startDate, endDate);

    const supabase = createSupabaseAdminClient();

    const startDateValue = toDateOnlyValue(startDate);
    const endDateValue = toDateOnlyValue(endDate);

    const status = endDateValue < toLocalDateValue(new Date()) ? "closed" : "active";

    const { error } = await supabase.from("fra").insert({
      user_id: fundraiser_id,
      category_id: category,
      title,
      description,
      target_amount: targetAmount,
      current_amount: 0,
      start_date: startDateValue,
      end_date: endDateValue,
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

function toDateOnlyValue(value: string) {
  const [date] = value.split("T");

  if (!date) {
    throw new Error("Date is required.");
  }

  return date;
}

function toLocalDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
