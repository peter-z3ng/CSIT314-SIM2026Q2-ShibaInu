import type { FRADTO } from "@/entity/FRA";

export type DonationDTO = {
  donationId: string | null;
  userId: string;
  fraId: string | null;
  username: string;
  amount: number;
  message: string | null;
  paymentMethod: string | null;
  paydate: string;
  fra: FRADTO | null;
};

export class Donation {
  readonly donationId: string | null;
  readonly userId: string;
  readonly fraId: string | null;
  readonly username: string;
  readonly amount: number;
  readonly message: string | null;
  readonly paymentMethod: string | null;
  readonly paydate: string;
  readonly fra: FRADTO | null;

  constructor(input: {
    donationId?: string | null;
    userId: string;
    fraId?: string | null;
    username: string;
    amount: number;
    message: string | null;
    paymentMethod?: string | null;
    paydate: string;
    fra?: FRADTO | null;
  }) {
    this.donationId = input.donationId ?? null;
    this.userId = input.userId;
    this.fraId = input.fraId ?? null;
    this.username = input.username;
    this.amount = input.amount;
    this.message = input.message;
    this.paymentMethod = input.paymentMethod ?? null;
    this.paydate = input.paydate;
    this.fra = input.fra ?? null;
  }

  viewDonationHistory(user_id: string): Donation[] {
    return this.userId === user_id ? [this] : [];
  }

  toDTO(): DonationDTO {
    return {
      donationId: this.donationId,
      userId: this.userId,
      fraId: this.fraId,
      username: this.username,
      amount: this.amount,
      message: this.message,
      paymentMethod: this.paymentMethod,
      paydate: this.paydate,
      fra: this.fra,
    };
  }
}
