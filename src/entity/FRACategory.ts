export class FRACategory {
  readonly categoryId: string;
  readonly categoryName: string;
  readonly userId: string;
  readonly description: string | null;
  readonly createdAt: string;
  readonly updatedAt: string | null;

  constructor(input: {
    categoryId: string;
    categoryName: string;
    userId: string;
    description?: string | null;
    createdAt: string;
    updatedAt?: string | null;
  }) {
    this.categoryId = input.categoryId;
    this.categoryName = input.categoryName;
    this.userId = input.userId;
    this.description = input.description ?? null;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt ?? null;
  }

  static createCategory(category_name: string, description: string, user_id: string): boolean {
    if (!category_name.trim()) {
      throw new Error("Category name is required.");
    }

    if (!user_id.trim()) {
      throw new Error("User id is required.");
    }

    return true;
  }

  toDTO(): FRACategoryDTO {
    return {
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      userId: this.userId,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export type FRACategoryDTO = {
  categoryId: string;
  categoryName: string;
  userId: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
};
