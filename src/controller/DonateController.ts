import { Donation } from "@/entity/Donation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type DonationRow = {
  donation_id: string;
  user_id: string;
  fra_id: string;
  amount: number;
  message: string | null;
  payment_method: string;
  paydate: string;
};

type FRAAmountRow = {
  current_amount: number;
};

export class DonateController {
  async donate(
    user_id: string,
    fra_id: string,
    amount: number,
    message: string | null,
    payment_method: string,
  ): Promise<Donation> {
    if (!user_id.trim()) {
      throw new Error("User id is required.");
    }

    if (!fra_id.trim()) {
      throw new Error("FRA id is required.");
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Donation amount must be greater than 0.");
    }

    if (!payment_method.trim()) {
      throw new Error("Payment method is required.");
    }

    const paydate = new Date().toISOString();
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("donation")
      .insert({
        user_id,
        fra_id,
        amount,
        message: message?.trim() || null,
        payment_method,
        paydate,
      })
      .select("donation_id, user_id, fra_id, amount, message, payment_method, paydate")
      .limit(1)
      .overrideTypes<DonationRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const donation = data[0];

    if (!donation) {
      throw new Error("Unable to save donation.");
    }

    await this.incrementFRACurrentAmount(fra_id, amount);

    return new Donation({
      donationId: donation.donation_id,
      userId: donation.user_id,
      fraId: donation.fra_id,
      username: "",
      amount: Number(donation.amount),
      message: donation.message,
      paymentMethod: donation.payment_method,
      paydate: donation.paydate,
    });
  }

  private async incrementFRACurrentAmount(fra_id: string, amount: number): Promise<number> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("fra")
      .select("current_amount")
      .eq("fra_id", fra_id)
      .limit(1)
      .overrideTypes<FRAAmountRow[], { merge: false }>();

    if (error) {
      throw new Error(error.message);
    }

    const currentAmount = Number(data[0]?.current_amount ?? 0);
    const nextAmount = currentAmount + amount;
    const { error: updateError } = await supabase
      .from("fra")
      .update({ current_amount: nextAmount })
      .eq("fra_id", fra_id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return nextAmount;
  }
}
