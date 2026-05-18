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
    description?: string | null;
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
    this.description = input.description ?? null;
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

  // createFRA(...)
  static createFRA(
    fundraiser_id: string,
    title: string,
    description: string,
    targetAmount: number,
    category: string,
    startDate: string,
    endDate: string,
  ): boolean {
    if (!fundraiser_id.trim()) {
      throw new Error("Fundraiser id is required.");
    }

    if (!title.trim()) {
      throw new Error("Title is required.");
    }

    if (!description.trim()) {
      throw new Error("Description is required.");
    }

    if (!category.trim()) {
      throw new Error("Please select a category.");
    }

    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      throw new Error("Target amount must be greater than 0.");
    }

    if (!startDate || !endDate) {
      throw new Error("Start date and end date are required.");
    }

    if (new Date(endDate) <= new Date(startDate)) {
      throw new Error("End date must be later than start date.");
    }

    return true;
  }

  // viewFRADetails(...)
  viewFRADetails(fraId: string) {
    if (this.fraId !== fraId) {
      throw new Error("FRA details do not match the requested id.");
    }

    return this;
  }

  // retrieveFRA(fra_id)
  retrieveFRA(fra_id: string): FRA {
    if (this.fraId !== fra_id) {
      throw new Error("FRA details do not match the requested id.");
    }

    return this;
  }

  // getFRAviewCount(fraId)
  getFRAviewCount(fraId: string): number {
    if (this.fraId !== fraId) {
      throw new Error("FRA details do not match the requested id.");
    }

    return this.viewCount;
  }

  // getFRAshortlistedCount(fraId)
  getFRAshortlistedCount(fraId: string): number {
    if (this.fraId !== fraId) {
      throw new Error("FRA details do not match the requested id.");
    }

    return this.favCount;
  }

  // updateFRA(...)
  static updateFRA(
    fra_id: string,
    title: string,
    description: string,
    category: string,
    endDate: string,
    status: string,
  ): boolean {
    if (!fra_id.trim()) {
      throw new Error("FRA id is required.");
    }

    if (!title.trim()) {
      throw new Error("Title is required.");
    }

    if (!description.trim()) {
      throw new Error("Description is required.");
    }

    if (!category.trim()) {
      throw new Error("Please select a category.");
    }

    if (!endDate) {
      throw new Error("End date is required.");
    }

    if (!["active", "closed", "completed"].includes(status)) {
      throw new Error("Invalid FRA status.");
    }

    return true;
  }

  // deleteFRA(fraId)
  static deleteFRA(fraId: string): boolean {
    if (!fraId.trim()) {
      throw new Error("FRA id is required.");
    }

    return true;
  }

  // searchFRA(...)
  static searchFRA(
    fraList: FRA[],
    keyword: string = "",
    category: string = "",
    startDate: string = "",
    endDate: string = "",
  ) {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const categoryIds = category
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item && item !== "all");

    return fraList.filter((fra) => {
      const matchesKeyword =
        !normalizedKeyword ||
        fra.title.toLowerCase().includes(normalizedKeyword) ||
        (fra.description?.toLowerCase().includes(normalizedKeyword) ?? false);
      const matchesCategory = !categoryIds.length || categoryIds.includes(fra.categoryId);
      const matchesStartDate = !startDate || fra.startDate >= startDate;
      const matchesEndDate = !endDate || (fra.endDate ?? fra.startDate) <= endDate;

      return matchesKeyword && matchesCategory && matchesStartDate && matchesEndDate;
    });
  }

  // searchMyFRAs(keyword, categoryId, startDate, endDate, status)
  static searchMyFRAs(
    fraList: FRA[],
    keyword: string = "",
    categoryId: string = "",
    startDate: string = "",
    endDate: string = "",
    status: string = "",
  ): FRA[] {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const categoryIds = splitFilterValues(categoryId);
    const statuses = splitFilterValues(status).filter((item) => ["active", "closed"].includes(item));

    return fraList.filter((fra) => {
      const matchesKeyword =
        !normalizedKeyword ||
        fra.title.toLowerCase().includes(normalizedKeyword) ||
        (fra.description?.toLowerCase().includes(normalizedKeyword) ?? false);
      const matchesCategory = !categoryIds.length || categoryIds.includes(fra.categoryId);
      const matchesStartDate = !startDate || fra.startDate >= startDate;
      const matchesEndDate = !endDate || (fra.endDate ?? fra.startDate) <= endDate;
      const matchesStatus = !statuses.length || statuses.includes(fra.status);

      return matchesKeyword && matchesCategory && matchesStartDate && matchesEndDate && matchesStatus;
    });
  }

  // getCompletedFRA(userId)
  static getCompletedFRA(fraList: FRA[], userId: string): FRA[] {
    if (!userId.trim()) {
      throw new Error("User id is required.");
    }

    return fraList.filter((fra) => fra.userId === userId && fra.status === "completed");
  }

  // searchCompletedFRAs(keyword, categoryId, startDate, endDate)
  static searchCompletedFRAs(
    fraList: FRA[],
    keyword: string = "",
    categoryId: string = "",
    startDate: string = "",
    endDate: string = "",
  ): FRA[] {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const categoryIds = splitFilterValues(categoryId);

    return fraList.filter((fra) => {
      const matchesCompletedStatus = fra.status === "completed";
      const matchesKeyword =
        !normalizedKeyword ||
        fra.title.toLowerCase().includes(normalizedKeyword) ||
        (fra.description?.toLowerCase().includes(normalizedKeyword) ?? false);
      const matchesCategory = !categoryIds.length || categoryIds.includes(fra.categoryId);
      const matchesStartDate = !startDate || fra.startDate >= startDate;
      const matchesEndDate = !endDate || (fra.endDate ?? fra.startDate) <= endDate;

      return (
        matchesCompletedStatus &&
        matchesKeyword &&
        matchesCategory &&
        matchesStartDate &&
        matchesEndDate
      );
    });
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

function splitFilterValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
