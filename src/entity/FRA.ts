export class FRA {
  readonly fraId: string;
  readonly userId: string;
  readonly categoryId: string;
  readonly title: string;
  readonly description: string | null;
  readonly targetAmount: number;
  readonly currentAmount: number;
  readonly startDate: string;
  readonly status: string;
  readonly viewCount: number;
  readonly favCount: number;
  readonly endDate: string | null;
  readonly createdAt: string;
  readonly updatedAt: string | null;

  constructor(input: {
    fraId: string;
    userId: string;
    categoryId: string;
    title: string;
    description: string | null;
    targetAmount: number;
    currentAmount: number;
    startDate: string;
    status: string;
    viewCount: number;
    favCount: number;
    endDate?: string | null;
    createdAt: string;
    updatedAt?: string | null;
  }) {
    this.fraId = input.fraId;
    this.userId = input.userId;
    this.categoryId = input.categoryId;
    this.title = input.title;
    this.description = input.description;
    this.targetAmount = input.targetAmount;
    this.currentAmount = input.currentAmount;
    this.startDate = input.startDate;
    this.status = input.status;
    this.viewCount = input.viewCount;
    this.favCount = input.favCount;
    this.endDate = input.endDate ?? null;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt ?? null;
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
      userId: this.userId,
      categoryId: this.categoryId,
      title: this.title,
      description: this.description,
      targetAmount: this.targetAmount,
      currentAmount: this.currentAmount,
      startDate: this.startDate,
      status: this.status,
      viewCount: this.viewCount,
      favCount: this.favCount,
      endDate: this.endDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      progressPercentage: this.progressPercentage,
    };
  }
}

export type FRADTO = {
  fraId: string;
  userId: string;
  categoryId: string;
  title: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  status: string;
  viewCount: number;
  favCount: number;
  endDate: string | null;
  createdAt: string;
  updatedAt: string | null;
  progressPercentage: number;
};
