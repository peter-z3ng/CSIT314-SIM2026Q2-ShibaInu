export class FRA {
  readonly fraId: string;
  readonly title: string;
  readonly description: string | null;
  readonly targetAmount: number;
  readonly currentAmount: number;
  readonly status: string;
  readonly categoryId: string | null;
  readonly category: string | null;

  constructor(input: {
    fraId: string;
    title: string;
    description: string | null;
    targetAmount: number;
    currentAmount: number;
    status: string;
    categoryId?: string | null;
    category?: string | null;
  }) {
    this.fraId = input.fraId;
    this.title = input.title;
    this.description = input.description;
    this.targetAmount = input.targetAmount;
    this.currentAmount = input.currentAmount;
    this.status = input.status;
    this.categoryId = input.categoryId ?? null;
    this.category = input.category ?? null;
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
      categoryId: this.categoryId,
      category: this.category,
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
  categoryId: string | null;
  category: string | null;
  progressPercentage: number;
};
