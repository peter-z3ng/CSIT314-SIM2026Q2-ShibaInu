export type DonationDTO = {
  userId: string;
  username: string;
  amount: number;
  message: string | null;
  paydate: string;
};

export class Donation {
  readonly userId: string;
  readonly username: string;
  readonly amount: number;
  readonly message: string | null;
  readonly paydate: string;

  constructor(input: DonationDTO) {
    this.userId = input.userId;
    this.username = input.username;
    this.amount = input.amount;
    this.message = input.message;
    this.paydate = input.paydate;
  }

  toDTO(): DonationDTO {
    return {
      userId: this.userId,
      username: this.username,
      amount: this.amount,
      message: this.message,
      paydate: this.paydate,
    };
  }
}
