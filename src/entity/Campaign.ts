import { Donation, type DonationInput } from "./Donation";

export type CampaignInput = {
  title: string;
  description: string;
  targetAmount: number;
  organizer: string;
  category: string;
};

export class Campaign {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly targetAmount: number;
  readonly organizer: string;
  readonly category: string;
  readonly donations: Donation[];

  constructor(input: CampaignInput, donations: Donation[] = [], id = crypto.randomUUID()) {
    if (!input.title.trim()) {
      throw new Error("Campaign title is required.");
    }

    if (!input.description.trim()) {
      throw new Error("Campaign description is required.");
    }

    if (!input.organizer.trim()) {
      throw new Error("Organizer name is required.");
    }

    if (!input.category.trim()) {
      throw new Error("Campaign category is required.");
    }

    if (!Number.isFinite(input.targetAmount) || input.targetAmount <= 0) {
      throw new Error("Target amount must be greater than 0.");
    }

    this.id = id;
    this.title = input.title.trim();
    this.description = input.description.trim();
    this.targetAmount = input.targetAmount;
    this.organizer = input.organizer.trim();
    this.category = input.category.trim();
    this.donations = donations;
  }

  get totalRaised() {
    return this.donations.reduce((total, donation) => total + donation.amount, 0);
  }

  get progressPercentage() {
    return Math.min(100, Math.round((this.totalRaised / this.targetAmount) * 100));
  }

  get donorCount() {
    return this.donations.length;
  }

  addDonation(input: DonationInput) {
    return new Campaign(
      this,
      [new Donation(input), ...this.donations],
      this.id,
    );
  }
}
