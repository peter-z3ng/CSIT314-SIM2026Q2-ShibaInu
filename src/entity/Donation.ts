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

  // searchDonationHistory(user_id, keyword, category, startDate, endDate, status)
  static searchDonationHistory(
    donations: Donation[],
    user_id: string,
    keyword: string,
    category: string,
    startDate: string,
    endDate: string,
    status: string,
  ): Donation[] {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const categoryIds = splitFilterValues(category);
    const statuses = splitFilterValues(status).map((item) => item.toLowerCase());

    return donations.filter((donation) => {
      if (donation.userId !== user_id || !donation.fra) {
        return false;
      }

      const donationDate = donation.paydate.slice(0, 10);
      const matchesKeyword =
        !normalizedKeyword ||
        donation.fra.title.toLowerCase().includes(normalizedKeyword) ||
        (donation.fra.description?.toLowerCase().includes(normalizedKeyword) ?? false) ||
        (donation.message?.toLowerCase().includes(normalizedKeyword) ?? false) ||
        (donation.paymentMethod?.toLowerCase().includes(normalizedKeyword) ?? false);
      const matchesCategory =
        !categoryIds.length || categoryIds.includes(donation.fra.categoryId);
      const matchesStartDate = !startDate || donationDate >= startDate;
      const matchesEndDate = !endDate || donationDate <= endDate;
      const matchesStatus =
        !statuses.length || statuses.includes(donation.fra.status.toLowerCase());

      return (
        matchesKeyword &&
        matchesCategory &&
        matchesStartDate &&
        matchesEndDate &&
        matchesStatus
      );
    });
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

function splitFilterValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item && item !== "all");
}
