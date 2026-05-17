import { FRACategory, type FRACategoryDTO } from "@/entity/FRACategory";

// SearchFRACategoryController
export class SearchFRACategoryController {
  private readonly categories: FRACategory[];

  constructor(categories: FRACategoryDTO[]) {
    this.categories = categories.map(
      (category) =>
        new FRACategory({
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          userId: category.userId,
          description: category.description,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        }),
    );
  }

  // searchCategory(keyword)
  searchCategory(keyword: string): FRACategoryDTO[] {
    return this.categories
      .filter((category) => category.searchCategory(keyword))
      .map((category) => category.toDTO());
  }
}
