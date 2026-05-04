import { FRA } from "@/entity/FRA";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type DonationAmountRow = {
  amount: number;
};

type FRARow = {
  fra_id: string;
  title: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  status: string;
};

export class DoneeController {
  async getTotalDonated(userId: string) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("donation")
      .select("amount")
      .eq("user_id", userId)
      .returns<DonationAmountRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.reduce((total, donation) => total + Number(donation.amount), 0);
  }

  async listFRA(): Promise<FRA[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("fra")
      .select("fra_id, title, description, target_amount, current_amount, status")
      .order("updated_at", { ascending: false, nullsFirst: false })
      .returns<FRARow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map((fra) => new FRA({
      fraId: fra.fra_id,
      title: fra.title,
      description: fra.description,
      targetAmount: Number(fra.target_amount),
      currentAmount: Number(fra.current_amount),
      status: fra.status,
    }));
  }
}
