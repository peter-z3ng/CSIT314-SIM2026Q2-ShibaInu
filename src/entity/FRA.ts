export class FRA {
  readonly fraId: string;
  readonly title: string;
  readonly description: string | null;
  readonly targetAmount: number;
  readonly currentAmount: number;
  readonly status: string;

  constructor(input: {
    fraId: string;
    title: string;
    description: string | null;
    targetAmount: number;
    currentAmount: number;
    status: string;
  }) {
    this.fraId = input.fraId;
    this.title = input.title;
    this.description = input.description;
    this.targetAmount = input.targetAmount;
    this.currentAmount = input.currentAmount;
    this.status = input.status;
  }

  get progressPercentage() {
    if (this.targetAmount <= 0) {
      return 0;
    }

    return Math.min(100, Math.round((this.currentAmount / this.targetAmount) * 100));
  }

  toDTO(): FRADTO {
    return {
      fraId: this.fraId,
      title: this.title,
      description: this.description,
      targetAmount: this.targetAmount,
      currentAmount: this.currentAmount,
      status: this.status,
      progressPercentage: this.progressPercentage,
    };
  }
}

export type FRADTO = {
  fraId: string;
  title: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  status: string;
  progressPercentage: number;
};
