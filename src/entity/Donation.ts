export type DonationInput = {
  donorName: string;
  amount: number;
  message?: string;
};

export class Donation {
  readonly id: string;
  readonly donorName: string;
  readonly amount: number;
  readonly message: string;
  readonly donatedAt: Date;

  constructor(input: DonationInput, donatedAt = new Date(), id = crypto.randomUUID()) {
    if (!input.donorName.trim()) {
      throw new Error("Donor name is required.");
    }

    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new Error("Donation amount must be greater than 0.");
    }

    this.id = id;
    this.donorName = input.donorName.trim();
    this.amount = input.amount;
    this.message = input.message?.trim() ?? "";
    this.donatedAt = donatedAt;
  }
}
