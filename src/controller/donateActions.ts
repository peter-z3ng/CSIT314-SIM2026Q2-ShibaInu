"use server";

import { revalidatePath } from "next/cache";
import { AuthController } from "@/controller/AuthController";
import { DonateController } from "@/controller/DonateController";

export type DonateState = {
  ok: boolean;
  message: string;
  donated: boolean;
  amount: number | null;
};

export async function processDonation(
  previousState: DonateState,
  formData: FormData,
): Promise<DonateState> {
  try {
    const profilePath = String(formData.get("profilePath") ?? "");
    const fra_id = String(formData.get("fra_id") ?? "");
    const amount = Number(formData.get("amount") ?? 0);
    const message = String(formData.get("message") ?? "").trim();
    const paymentMethod = String(formData.get("paymentOption") ?? "").trim();

    const account = await new AuthController().requireProfilePath(profilePath);

    if (account.profile.profile.toLowerCase() !== "donee") {
      throw new Error("Only donee accounts can donate.");
    }

    await new DonateController().donate(
      account.userId,
      fra_id,
      amount,
      message || null,
      paymentMethod,
    );

    revalidatePath(`/${profilePath}/browse/${fra_id}`);
    revalidatePath(`/${profilePath}/donations`);
    revalidatePath(`/${profilePath}/dashboard`);

    return {
      ok: true,
      message: "Donation successful.",
      donated: true,
      amount,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to save donation.",
      donated: previousState.donated,
      amount: previousState.amount,
    };
  }
}
