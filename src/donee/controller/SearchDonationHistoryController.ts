import { Donation } from "@/entity/Donation";
import { FRA } from "@/entity/FRA";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type DonationHistoryRow = {
  donation_id: string;
  user_id: string;
  fra_id: string;
  amount: number;
  message: string | null;
  payment_method: string | null;
  paydate: string;
  fra: FRARow | null;
};

type FRARow = {
  fra_id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  start_date: string;
  status: string;
  view_count: number;
  fav_count: number;
  end_date: string | null;
  created_at: string;
  updated_at: string | null;
};

// SearchDonationHistoryController
export class SearchDonationHistoryController {
  // searchDonationHistory(user_id, keyword, category, startDate, endDate, status)
  async searchDonationHistory(
    user_id: string,
    keyword: string = "",
    category: string = "",
    startDate: string = "",
    endDate: string = "",
    status: string = "",
  ): Promise<Donation[]> {
    if (!user_id.trim()) {
      throw new Error("User id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("donation")
      .select(
        "donation_id, user_id, fra_id, amount, message, payment_method, paydate, fra:fra_id(fra_id, user_id, category_id, title, description, target_amount, current_amount, start_date, status, view_count, fav_count, end_date, created_at, updated_at)",
      )
      .eq("user_id", user_id)
      .order("paydate", { ascending: false })
      .overrideTypes<DonationHistoryRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return Donation.searchDonationHistory(
      data.map(mapDonationHistoryRow),
      user_id,
      keyword,
      category,
      startDate,
      endDate,
      status,
    );
  }
}

function mapDonationHistoryRow(row: DonationHistoryRow) {
  return new Donation({
    donationId: row.donation_id,
    userId: row.user_id,
    fraId: row.fra_id,
    username: "",
    amount: Number(row.amount),
    message: row.message,
    paymentMethod: row.payment_method,
    paydate: row.paydate,
    fra: row.fra ? mapFRARow(row.fra).toDTO() : null,
  });
}

function mapFRARow(row: FRARow) {
  return new FRA({
    fraId: row.fra_id,
    userId: row.user_id,
    categoryId: row.category_id,
    title: row.title,
    description: row.description,
    targetAmount: Number(row.target_amount),
    currentAmount: Number(row.current_amount),
    status: row.status,
    startDate: row.start_date,
    viewCount: Number(row.view_count),
    favCount: Number(row.fav_count),
    endDate: row.end_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}
