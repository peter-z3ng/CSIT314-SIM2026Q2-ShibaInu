import { FRA } from "@/entity/FRA";
import { ViewCompletedFRAController } from "@/fundraiser/controller/ViewCompletedFRAController";

export type SearchCompletedFRAInput = {
  userId: string;
  keyword?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
};

// SearchCompletedFRAController
export class SearchCompletedFRAController {
  // searchCompletedFRAs(keyword, categoryId, startDate, endDate)
  async searchCompletedFRAs(input: SearchCompletedFRAInput): Promise<FRA[]> {
    if (!input.userId.trim()) {
      throw new Error("User id is required.");
    }

    const viewCompletedFRAController = new ViewCompletedFRAController();
    const completedFRAs = await viewCompletedFRAController.getCompletedFRA(input.userId);

    return FRA.searchCompletedFRAs(
      completedFRAs,
      input.keyword,
      input.categoryId,
      input.startDate,
      input.endDate,
    );
  }
}
