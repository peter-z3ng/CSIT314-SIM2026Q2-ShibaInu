import { FRA } from "@/entity/FRA";
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

type DonationRow = {
  fra_id: string;
  user_id: string;
  amount: number;
  message: string | null;
  paydate: string;
};

type UserRow = {
  user_id: string;
  username: string;
};

export type RecentDonationDTO = {
  fraId: string;
  fraTitle: string;
  username: string;
  amount: number;
  message: string | null;
  paydate: string;
};

export class FundraiserController {
  async listMyFRAs(userId: string): Promise<FRA[]> {
    const autoCloseController = new AutoCloseFRAController();
    await autoCloseController.autoCloseExpiredFRAs();

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("fra")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .overrideTypes<FRARow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map(
      (fra) =>
        new FRA({
          fraId: fra.fra_id,
          userId: fra.user_id,
          categoryId: fra.category_id,
          title: fra.title,
          description: fra.description,
          targetAmount: Number(fra.target_amount),
          currentAmount: Number(fra.current_amount),
          startDate: fra.start_date,
          status: fra.status,
          viewCount: Number(fra.view_count),
          favCount: Number(fra.fav_count),
          endDate: fra.end_date,
          createdAt: fra.created_at,
          updatedAt: fra.updated_at,
        }),
    );
  }

  async listRecentDonations(userId: string): Promise<RecentDonationDTO[]> {
    const supabase = createSupabaseAdminClient();

    const { data: fraRows, error: fraError } = await supabase
      .from("fra")
      .select("fra_id, title")
      .eq("user_id", userId)
      .overrideTypes<{ fra_id: string; title: string }[], { merge: false }>();

    if (fraError) {
      throw new Error(fraError.message);
    }

    if (fraRows.length === 0) {
      return [];
    }

    const fraIds = fraRows.map((fra) => fra.fra_id);
    const fraTitleById = new Map(
      fraRows.map((fra) => [fra.fra_id, fra.title]),
    );

    const { data: donations, error: donationError } = await supabase
      .from("donation")
      .select("fra_id, user_id, amount, message, paydate")
      .in("fra_id", fraIds)
      .order("paydate", { ascending: false })
      .limit(3)
      .overrideTypes<DonationRow[], { merge: false }>();

    if (donationError) {
      throw new Error(donationError.message);
    }

    if (donations.length === 0) {
      return [];
    }

    const donorIds = Array.from(
      new Set(donations.map((donation) => donation.user_id)),
    );

    const { data: users, error: userError } = await supabase
      .from("user_account")
      .select("user_id, username")
      .in("user_id", donorIds)
      .overrideTypes<UserRow[], { merge: false }>();

    if (userError) {
      throw new Error(userError.message);
    }

    const usernameById = new Map(
      users.map((user) => [user.user_id, user.username]),
    );

    return donations.map((donation) => ({
      fraId: donation.fra_id,
      fraTitle: fraTitleById.get(donation.fra_id) ?? "Unknown FRA",
      username: usernameById.get(donation.user_id) ?? "Anonymous",
      amount: Number(donation.amount),
      message: donation.message,
      paydate: donation.paydate,
    }));
  }
}