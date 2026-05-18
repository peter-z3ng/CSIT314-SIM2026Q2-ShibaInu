import { Donation } from "@/entity/Donation";
import { FRA } from "@/entity/FRA";
import { SaveFavouriteController } from "@/donee/controller/SaveFavouriteController";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AutoCloseFRAController } from "@/controller/AutoCloseFRAController";

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

type FRAViewCountRow = {
  view_count: number;
};

type FundraiserRow = {
  username: string;
};

type DonationUserRow = {
  user_id: string;
  username: string;
};

// ViewFRADetailsController
export class ViewFRADetailsController {
  // viewFRADetails(...)
  async viewFRADetails(fra_id: string): Promise<FRA> {
    if (!fra_id.trim()) {
      throw new Error("FRA id is required.");
    }

    const autoCloseController = new AutoCloseFRAController();
    await autoCloseController.autoCloseExpiredFRAs();
    await new SaveFavouriteController().syncFavouriteCount(fra_id);

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("fra")
      .select(
        "fra_id, user_id, category_id, title, description, target_amount, current_amount, start_date, status, view_count, fav_count, end_date, created_at, updated_at",
      )
      .eq("fra_id", fra_id)
      .limit(1)
      .overrideTypes<FRARow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const fra = data[0];

    if (!fra) {
      throw new Error("FRA was not found.");
    }

    return mapFRARow(fra).viewFRADetails(fra_id);
  }

  async incrementFRAViewCount(fra_id: string): Promise<number> {
    if (!fra_id.trim()) {
      throw new Error("FRA id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("fra")
      .select("view_count")
      .eq("fra_id", fra_id)
      .limit(1)
      .overrideTypes<FRAViewCountRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const currentViewCount = Number(data[0]?.view_count ?? 0);
    const nextViewCount = currentViewCount + 1;
    const { error: updateError } = await supabase
      .from("fra")
      .update({ view_count: nextViewCount })
      .eq("fra_id", fra_id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return nextViewCount;
  }

  async viewFundraiserUsername(user_id: string): Promise<string> {
    if (!user_id.trim()) {
      throw new Error("User id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_account")
      .select("username")
      .eq("user_id", user_id)
      .limit(1)
      .overrideTypes<FundraiserRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return data[0]?.username ?? "Unknown fundraiser";
  }

  async viewRecentDonations(fra_id: string): Promise<Donation[]> {
    if (!fra_id.trim()) {
      throw new Error("FRA id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data: donations, error } = await supabase
      .from("donation")
      .select("user_id, amount, message, payment_method, paydate")
      .eq("fra_id", fra_id)
      .order("paydate", { ascending: false })
      .limit(5);
    console.log("FRA ID:", fra_id);
    console.log("DONATIONS:", donations);
    console.log("ERROR:", error);

    if (error) {
      throw new Error(error.message);
    }

    if (!donations.length) {
      return [];
    }

    const userIds = Array.from(new Set(donations.map((donation) => donation.user_id)));
    const { data: users, error: userError } = await supabase
      .from("user_account")
      .select("user_id, username")
      .in("user_id", userIds)
      .overrideTypes<DonationUserRow[], { merge: false }>();

    if (userError) {
      throw new Error(userError.message);
    }

    const usernameById = new Map(users.map((user) => [user.user_id, user.username]));

    return donations.map(
      (donation) =>
        new Donation({
          userId: donation.user_id,
          username: usernameById.get(donation.user_id) ?? "Unknown donor",
          amount: Number(donation.amount),
          message: donation.message,
          paymentMethod: donation.payment_method,
          paydate: donation.paydate,
        }),
    );
  }
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
    startDate: row.start_date,
    status: row.status,
    viewCount: Number(row.view_count),
    favCount: Number(row.fav_count),
    endDate: row.end_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}
